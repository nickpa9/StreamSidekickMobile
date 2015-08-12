(function () {
    'use strict';

    angular.module('movieApp').controller('GenreMovieListController', ['$stateParams', '$state', '$ionicLoading', '$ionicPopup', 'moviesApi', 'CacheFactory', GenreMovieListController]);

    function GenreMovieListController($stateParams, $state, $ionicLoading, $ionicPopup, moviesApi, CacheFactory) {
        var vm = this;
        var genre = $stateParams.genre || {};
        var shortlistedMovies = CacheFactory.get('shortlistedMovies');

        $ionicLoading.show({
            template: 'Finding movies..'
        });

        vm.genre = genre.name;
        moviesApi.getMoviesByGenre(vm.genre).then(function (response) {
            vm.genreMovies = response;
        }).catch(function () {
            $ionicLoading.hide();
            $state.go("home.genres");
            $ionicPopup.alert({
                title: "No movies found",
                content: "We've got a problem here. Please check your internet connection."
            });
        }).finally(function () {
            vm.cleanUpResults();
            $ionicLoading.hide();
        });

        vm.selectMovie = function (movie) {
            $state.go("home.genreMovie", {
                "movieName": movie.title,
                "genre": genre,
                "imdbId": movie.imdbId
            });
        };

        vm.cleanUpResults = function () {
            vm.genreMovies.forEach(function (movie) {
                for (var key in movie) {
                    if (movie[key] === 'N/A' || 0) {
                        delete movie[key];
                    }
                }
            });
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