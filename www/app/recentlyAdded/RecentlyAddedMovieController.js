(function () {
    'use strict';

    angular.module('movieApp').controller('RecentlyAddedMovieController', ['$stateParams', '$state', '$scope', 'moviesApi', RecentlyAddedMovieController]);

    function RecentlyAddedMovieController($stateParams, $state, $scope, moviesApi) {
        var vm = this;
        var isTop10List = false;
        var movieName = $stateParams.movieName;
        var recentlyAddedMovieCount;

        this.initialise = function () {
            moviesApi.getRecentlyAddedMoviesCount().then(function (response) {
                recentlyAddedMovieCount = response;
                vm.loadList(false);
            });
        };

        this.getRandomMovieIndex = function () {
            return Math.floor(Math.random() * (recentlyAddedMovieCount - 1)) + 1;
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
            moviesApi.getRecentlyAddedMovieByIndex(nextMovieIndex).then(function (movie) {
                nextMovie = movie;
                $state.go('home.recentlyAddedMovie', {
                    "movieName": nextMovie.title,
                    "previousTitle": movieName
                });
            });
        };

        vm.navigateToPreviousMovie = function (previousMovieIndex) {
            moviesApi.getRecentlyAddedMovieByIndex(previousMovieIndex).then(function (movie) {
                $state.go('home.recentlyAddedMovie', {
                    "movieName": movie.title,
                    "previousTitle": movieName
                });
            });
        };

        vm.navigateToPreviousMovieByTitle = function (previousMovieTitle) {
            moviesApi.getMovieDataByTitle(previousMovieTitle).then(function (movie) {
                $state.go('home.recentlyAddedMovie', {
                    "movieName": movie.title,
                    "previousTitle": movieName
                });
            });
        };

        vm.swipeLeft = function () {
            var randomMovieIndex = this.getRandomMovieIndex();
            this.navigateToNextMovie(randomMovieIndex);
        };

        vm.swipeRight = function () {
            if ($stateParams.previousTitle) {
                this.navigateToPreviousMovieByTitle($stateParams.previousTitle);
            }
        };

        this.initialise();
    }

})();