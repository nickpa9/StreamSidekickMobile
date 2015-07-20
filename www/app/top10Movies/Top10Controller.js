(function () {
    'use strict';

    angular.module('movieApp').controller('Top10Controller', ['$state', 'moviesApi', 'CacheFactory', Top10Controller]);

    function Top10Controller($state, moviesApi, CacheFactory) {
        var vm = this;
        var shortlistedMovies = CacheFactory.get('shortlistedMovies');

        moviesApi.getTop10Movies().then(function (response) {
            vm.top10Movies = response;
        }).finally(function () {
            vm.cleanUpResults();
        });

        vm.selectMovie = function (movie, rank) {
            $state.go("home.movie", {
                "movieName": movie.title,
                "rank": rank + 1,
                "top10": true,
                "imdbId": movie.imdbId
            });
        };

        vm.cleanUpResults = function () {
            vm.top10Movies.forEach(function (movie) {
                for (var key in movie) {
                    if (movie[key] === 'N/A' || 0) {
                        delete movie[key];
                    }
                }
            });
        };

        vm.isMovieShortlisted = function (movieTitle) {
            if (movieTitle && movieTitle.length > 0) {
                var shortlistedMovie = shortlistedMovies.get(movieTitle);
                if (shortlistedMovie) {
                    return shortlistedMovie.shortlisted;
                }
            } else {
                return 'false';
            }
        };

        vm.toggleShortlisted = function (movieTitle, toggleBoolean) {
            console.log('hello');
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