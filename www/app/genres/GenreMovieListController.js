(function () {
    'use strict';

    angular.module('movieApp').controller('GenreMovieListController', ['$stateParams', '$state', 'moviesApi', GenreMovieListController]);

    function GenreMovieListController($stateParams, $state, moviesApi) {
        var vm = this;
        var genre = $stateParams.genre;
        vm.genre = genre.name;
        moviesApi.getMoviesByGenre(vm.genre).then(function (response) {
            vm.genreMovies = response;
        });

        vm.selectMovie = function (movie) {
            $state.go("home.genreMovie", {
                "movieName": movie.title,
                "genre": genre
            });
        };
    }

})();