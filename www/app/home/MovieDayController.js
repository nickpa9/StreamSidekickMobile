(function () {
    'use strict';

    angular.module('movieApp').controller('MovieDayController', ['moviesApi', MovieDayController]);

    function MovieDayController(moviesApi) {
        moviesApi.getAllMovieData();
    }

})();