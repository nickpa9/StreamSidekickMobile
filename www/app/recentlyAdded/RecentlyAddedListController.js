(function () {
    'use strict';

    angular.module('movieApp').controller('RecentlyAddedListController', ['$state', '$ionicLoading', '$ionicPopup', 'moviesApi', 'CacheFactory', RecentlyAddedListController]);

    function RecentlyAddedListController($state, $ionicLoading, $ionicPopup, moviesApi, CacheFactory) {
        var vm = this;
        var shortlistedMovies = CacheFactory.get('shortlistedMovies');

        $ionicLoading.show({
            template: 'Finding movies..'
        });

        moviesApi.getRecentlyAddedMovies().then(function (response) {
            vm.movies = response;
        }).catch(function () {
            $ionicLoading.hide();
            $ionicPopup.alert({
                title: "No movies found",
                content: "We've got a problem here. Please check your internet connection."
            });
            $state.go('home.movieDay');
        }).finally(function () {
            vm.cleanUpResults();
            $ionicLoading.hide();
        });

        vm.selectMovie = function (movie) {
            $state.go("home.recentlyAddedMovie", {
                "movieName": movie.title,
                "imdbId": movie.imdbId
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