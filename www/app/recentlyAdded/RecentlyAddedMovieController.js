(function () {
    'use strict';

    angular.module('movieApp').controller('RecentlyAddedMovieController', ['$stateParams', '$state', '$scope', 'moviesApi', 'CacheFactory', RecentlyAddedMovieController]);

    function RecentlyAddedMovieController($stateParams, $state, $scope, moviesApi, CacheFactory) {
        var vm = this;
        var movieName = $stateParams.movieName;
        var recentlyAddedMovieCount;
        var shortlistedMovies = CacheFactory.get('shortlistedMovies');


        this.initialise = function () {
            moviesApi.getRecentlyAddedMoviesCount().then(function (response) {
                recentlyAddedMovieCount = response;
                vm.loadList(false);
            });
        };

        this.getRandomMovieIndex = function () {
            return Math.floor(Math.random() * (recentlyAddedMovieCount - 1)) + 1;
        };

        vm.loadInitialMovie = function () {
            if ($stateParams.movieName) {
                moviesApi.getMovieDataByTitle(movieName).then(function (response) {
                    vm.movie = response;
                }).finally(function () {
                    $scope.$broadcast('scroll.refreshComplete');
                    vm.cleanUpResults();
                });
            } else {
                vm.navigateToNextMovie(this.getRandomMovieIndex());
            }
        };

        vm.goToYoutubeVideo = function () {
            var youtubeVideo = "http://youtube.com/watch?v=" + vm.movie.trailers[0].videoKey;
            console.log(youtubeVideo);
            window.open(youtubeVideo, '_system');
            return false;
        };

        vm.cleanUpResults = function () {
            for (var key in vm.movie) {
                if(vm.movie[key] === 'N/A' || 0) {
                    delete vm.movie[key];
                }
            }
        };

        vm.loadList = function () {
            this.loadInitialMovie();
        };

        vm.navigateToNextMovie = function (nextMovieIndex) {
            var nextMovie;
            moviesApi.getRecentlyAddedMovieByIndex(nextMovieIndex).then(function (movie) {
                nextMovie = movie;
                $state.go('home.recentlyAddedMovie', {
                    "movieName": nextMovie.title,
                    "previousTitle": movieName
                });
            });
        };

        vm.navigateToPreviousMovie = function (previousMovieIndex) {
            moviesApi.getRecentlyAddedMovieByIndex(previousMovieIndex).then(function (movie) {
                $state.go('home.recentlyAddedMovie', {
                    "movieName": movie.title,
                    "previousTitle": movieName
                });
            });
        };

        vm.navigateToPreviousMovieByTitle = function (previousMovieTitle) {
            moviesApi.getMovieDataByTitle(previousMovieTitle).then(function (movie) {
                $state.go('home.recentlyAddedMovie', {
                    "movieName": movie.title,
                    "previousTitle": movieName
                });
            });
        };

        vm.swipeLeft = function () {
            var randomMovieIndex = this.getRandomMovieIndex();
            this.navigateToNextMovie(randomMovieIndex);
        };

        vm.swipeRight = function () {
            if ($stateParams.previousTitle) {
                this.navigateToPreviousMovieByTitle($stateParams.previousTitle);
            }
        };

        vm.toggleShortlistedMovie = function (movieTitle) {
            if (vm.isMovieShortlisted(movieTitle)) {
                shortlistedMovies.remove(movieTitle);
                jQuery('.shortlistMessage').removeClass('shortlisted');
            } else {
                shortlistedMovies.put(movieTitle, {'shortlisted': true});
                jQuery('.shortlistMessage').addClass('shortlisted');
            }
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

        vm.convertSentenceToParagraphs = function (sentence) {
            var shortSentence = '<p>';
            var sentenceArray = sentence.split('.');
            for (var i = 0; i < sentenceArray.length - 1; i++) {
                shortSentence += sentenceArray[i];
                if (sentenceArray[i].length > 60) {
                    shortSentence += ".</p><p>";
                }
            }
            return shortSentence.length > 1 ? shortSentence + '</p>' : sentence;
        };

        this.initialise();
    }

})();