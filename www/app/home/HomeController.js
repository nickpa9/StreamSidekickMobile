(function () {
    'use strict';

    angular.module('movieApp').controller('HomeController', ['CacheFactory', HomeController]);

    function HomeController(CacheFactory) {
        var vm = this;
        var shortlistedMovies = CacheFactory.get('shortlistedMovies') || [];

        vm.getShortlistedMoviesCount = function() {
            var shortlistedMoviesStorage = window.localStorage.getItem('angular-cache.caches.shortlistedMovies.keys');
            if (!shortlistedMoviesStorage) {
                return 0;
            } else {
                if (shortlistedMoviesStorage.length === 2) {
                    return 0;
                } else {
                    return window.localStorage.getItem('angular-cache.caches.shortlistedMovies.keys').split(',').length;
                }
            }
        };

    }
})();