(function () {
    'use strict';

    angular.module('movieApp').controller('RecentlyAddedListController', ['$state', 'moviesApi', RecentlyAddedListController]);

    function RecentlyAddedListController($state, moviesApi) {
        var vm = this;

        moviesApi.getRecentlyAddedMovies().then(function (response) {
            vm.movies = response;
        });

        vm.selectMovie = function (movie) {
            $state.go("home.recentlyAddedMovie", {
                "movieName": movie.title
            });
        };
    }

})();