(function () {
    'use strict';

    angular.module('movieApp').controller('Top10Controller', ['$state', 'moviesApi', Top10Controller]);

    function Top10Controller($state, moviesApi) {
        var vm = this;
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
    }

})();