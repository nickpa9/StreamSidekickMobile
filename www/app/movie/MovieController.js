(function () {
    'use strict';

    angular.module('movieApp').controller('MovieController', ['$stateParams', '$state', '$scope', 'moviesApi', MovieController]);

    function MovieController($stateParams, $state, $scope, moviesApi) {
        var vm = this;
        var isTop10List = false;
        var movieName = $stateParams.movieName;
        var currentMovieRank;

        this.initialise = function () {
            this.setListStatus();
            vm.loadList(false);
        };

        this.setListStatus = function () {
            if ($stateParams.top10) {
                isTop10List = true;
                currentMovieRank = parseInt($stateParams.rank) || undefined;
            }
        };

        this.getRandomMovieIndex = function () {
            return Math.floor(Math.random() * (40 - 1)) + 1;
        };

        vm.loadInitialMovie = function () {
            if ($stateParams.movieName) {
                moviesApi.getMovieDataByTitle(movieName).then(function (response) {
                    vm.movie = response;
                }).finally(function () {
                    $scope.$broadcast('scroll.refreshComplete');
                });
            } else {
                vm.navigateToNextMovie(this.getRandomMovieIndex());
            }
        };

        vm.loadList = function () {
            this.loadInitialMovie();
        };

        vm.navigateToNextMovie = function (nextMovieIndex) {
            var nextMovie;
            moviesApi.getMovieByIndex(nextMovieIndex).then(function (movie) {
                nextMovie = movie;
                $state.go('home.movie', {
                    "movieName": nextMovie.title,
                    "rank": currentMovieRank,
                    "previousTitle": movieName
                });
            });
        };

        vm.navigateToPreviousMovie = function (previousMovieIndex) {
            moviesApi.getMovieByIndex(previousMovieIndex).then(function (movie) {
                $state.go('home.movie', {
                    "movieName": movie.title,
                    "rank": previousMovieIndex,
                    "previousTitle": movieName
                });
            });
        };

        vm.navigateToPreviousMovieByTitle = function (previousMovieTitle) {
            moviesApi.getMovieDataByTitle(previousMovieTitle).then(function (movie) {
                $state.go('home.movie', {
                    "movieName": movie.title,
                    "previousTitle": movieName
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