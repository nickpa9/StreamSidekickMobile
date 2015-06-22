(function () {
    'use strict';

    angular.module('movieApp').controller('GenreMovieController', ['$stateParams', '$state', '$scope', 'moviesApi', GenreMovieController]);

    function GenreMovieController($stateParams, $state, $scope, moviesApi) {
        var vm = this;
        var isTop10List = false;
        var movieName = $stateParams.movieName;
        var genre = $stateParams.genre;
        var currentMovieRank;
        var genreMovieCount;

        this.initialise = function () {
            this.setListStatus();
            vm.loadList(false);
            this.getGenreMoviesCount();
        };

        this.getGenreMoviesCount = function () {
            moviesApi.getGenreMoviesCount(genre.name).then(function (response) {
                genreMovieCount = response;
            });
        };

        this.setListStatus = function () {
            if ($stateParams.top10) {
                isTop10List = true;
                currentMovieRank = parseInt($stateParams.rank) || undefined;
            }
        };

        this.getRandomMovieIndex = function () {
            return Math.floor(Math.random() * (genreMovieCount - 1)) + 1;
        };

        vm.loadInitialMovie = function () {
            if ($stateParams.movieName) {
                moviesApi.getMovieDataByTitle(movieName).then(function (response) {
                    vm.movie = response;
                }).finally(function () {
                    $scope.$broadcast('scroll.refreshComplete');
                    vm.cleanUpResults();
                });
            } else {
                vm.navigateToNextMovie(this.getRandomMovieIndex());
            }
        };

        vm.cleanUpResults = function () {
            for (var key in vm.movie) {
                if(vm.movie[key] === 'N/A' || 0) {
                    delete vm.movie[key];
                }
            }
        };

        vm.loadList = function () {
            this.loadInitialMovie();
        };

        vm.navigateToNextMovie = function (nextMovieIndex) {
            var nextMovie;
            moviesApi.getMovieByGenreAndIndex(genre.name, nextMovieIndex).then(function (movie) {
                nextMovie = movie;
                $state.go('home.genreMovie', {
                    "movieName": nextMovie.title,
                    "rank": currentMovieRank,
                    "previousTitle": movieName,
                    "genre": genre
                });
            });
        };

        vm.navigateToPreviousMovie = function (previousMovieIndex) {
            moviesApi.getMovieByGenreAndIndex(genre.name, previousMovieIndex).then(function (movie) {
                $state.go('home.genreMovie', {
                    "movieName": movie.title,
                    "rank": previousMovieIndex,
                    "previousTitle": movieName,
                    "genre": genre
                });
            });
        };

        vm.navigateToPreviousMovieByTitle = function (previousMovieTitle) {
            moviesApi.getMovieDataByTitle(previousMovieTitle).then(function (movie) {
                $state.go('home.genreMovie', {
                    "movieName": movie.title,
                    "previousTitle": movieName,
                    "genre": genre
                });
            });
        };

        vm.swipeLeft = function () {
            currentMovieRank = (parseInt($stateParams.rank) + 1) || 0;
            if (isTop10List) {
                this.navigateToNextMovie(currentMovieRank);
            } else {
                var randomMovieIndex = this.getRandomMovieIndex();
                this.navigateToNextMovie(randomMovieIndex);
            }
        };

        vm.swipeRight = function () {
            currentMovieRank = (parseInt($stateParams.rank) - 1) || 0;
            if (isTop10List) {
                this.navigateToPreviousMovie(currentMovieRank);
            } else if ($stateParams.previousTitle) {
                this.navigateToPreviousMovieByTitle($stateParams.previousTitle);
            }

        };

        this.initialise();
    }

})();