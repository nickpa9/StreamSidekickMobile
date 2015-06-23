(function () {
    'use strict';

    angular.module('movieApp').controller('HomeController', ['$state', 'CacheFactory', HomeController]);

    function HomeController($state, CacheFactory) {
        var vm = this;
        var shortlistedMovies = CacheFactory.get('shortlistedMovies');

        vm.getShortlistedMoviesCount = function() {
            if (window.localStorage.getItem('angular-cache.caches.shortlistedMovies.keys').length === 2) {
                return 0;
            } else {
                return window.localStorage.getItem('angular-cache.caches.shortlistedMovies.keys').split(',').length;
            }
        };

    }
})();