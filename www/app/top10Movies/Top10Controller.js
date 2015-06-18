(function () {
    'use strict';

    angular.module('movieApp').controller('Top10Controller', ['$state', 'moviesApi', 'CacheFactory', Top10Controller]);

    function Top10Controller($state, moviesApi, CacheFactory) {
        var vm = this;
        var shortlistedMovies = CacheFactory.get('shortlistedMovies');

        moviesApi.getTop10Movies().then(function (response) {
            vm.top10Movies = response;
        });

        vm.selectMovie = function (movie, rank) {
            $state.go("home.movie", {
                "movieName": movie.title,
                "rank": rank + 1,
                "top10": true
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

        vm.toggleShortlisted = function (movieTitle) {
            if (vm.isMovieShortlisted(movieTitle)) {
                shortlistedMovies.put(movieTitle, {'shortlisted': false});
            } else {
                shortlistedMovies.put(movieTitle, {'shortlisted': true});
            }
            vm.isMovieShortlisted(movieTitle);
            console.log(shortlistedMovies.get(movieTitle));

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