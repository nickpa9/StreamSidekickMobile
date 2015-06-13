(function () {
    'use strict';

    angular.module('movieApp').controller('GenresController', ['$state', 'moviesApi', GenresController]);

    function GenresController($state) {
        var vm = this;

        vm.genres = [
            {name: 'Action'},
            {name: 'Adventure'},
            {name: 'Comedy'},
            {name: 'Documentary'},
            {name: 'Drama'},
            {name: 'Family'},
            {name: 'Horror'},
            {name: 'Romance'},
            {name: 'Sci-Fi'},
            {name: 'Thriller'}
        ];

        vm.selectGenre = function (genre) {
            console.log('selectGenre', genre);
            $state.go("home.genreMovieList", {
                "genre": genre
            });
        };
    }

})();