(function () {
    'use strict';

    angular.module('movieApp').controller('RecentlyAddedListController', ['$state', 'moviesApi', 'CacheFactory', RecentlyAddedListController]);

    function RecentlyAddedListController($state, moviesApi, CacheFactory) {
        var vm = this;
        var shortlistedMovies = CacheFactory.get('shortlistedMovies');


        moviesApi.getRecentlyAddedMovies().then(function (response) {
            vm.movies = response;
        }).finally(function () {
            vm.cleanUpResults();

        });

        vm.selectMovie = function (movie) {
            $state.go("home.recentlyAddedMovie", {
                "movieName": movie.title
            });
        };

        vm.cleanUpResults = function () {
            vm.movies.forEach(function (movie) {
                for (var key in movie) {
                    if (movie[key] === 'N/A' || 0) {
                        delete movie[key];
                    }
                }
            });
        };

        vm.isMovieShortlisted = function (movieTitle) {
            var shortlistedMovie = shortlistedMovies.get(movieTitle);
            if (shortlistedMovie) {
                return shortlistedMovie.shortlisted;
            } else {
                return false;
            }
        };

        vm.toggleShortlisted = function (movieTitle, toggleBoolean) {
            if (vm.isMovieShortlisted(movieTitle)) {
                shortlistedMovies.remove(movieTitle);
            } else {
                shortlistedMovies.put(movieTitle, {'shortlisted': toggleBoolean});
            }
            vm.isMovieShortlisted(movieTitle);
        };

        vm.isMovieShortlisted = function (movieTitle) {
            var shortlistedMovie = shortlistedMovies.get(movieTitle);
            if (shortlistedMovie) {
                return shortlistedMovie.shortlisted;
            } else {
                return false;
            }
        };
    }

})();