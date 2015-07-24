angular.module('movieApp', ['ionic', 'angular-cache'])

.run(function ($ionicPlatform, CacheFactory) {
  $ionicPlatform.ready(function () {
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      StatusBar.styleDefault();
    }
    CacheFactory('moviesCache', { storageMode: 'localStorage', maxAge: 60*60*24*7, deleteOnExpire: 'aggressive' });
    CacheFactory('topRatedMovies', { storageMode: 'localStorage', maxAge: 60*60*24*5, deleteOnExpire: 'aggressive' });
    CacheFactory('genreMovies', { storageMode: 'localStorage', maxAge: 60*60*24*5, deleteOnExpire: 'aggressive' });
    CacheFactory('recentlyAddedMovies', { storageMode: 'localStorage', maxAge: 60*60*24, deleteOnExpire: 'aggressive' });
    CacheFactory('staticCache', { storageMode: 'localStorage' });
    CacheFactory('shortlistedMovies', {storageMode: 'localStorage', maxAge: 100000000*10000000, deleteOnExpire: 'aggressive' });
  });
})

.config(function($stateProvider, $urlRouterProvider) {


      $stateProvider
    .state('home', {
      abstract: true,
      cache: false,
      url: "/home",
      templateUrl: "app/home/home.html"
    })

    .state('home.movie', {
      url: "/movies/:movieName?:rank",
      cache: false,
      views: {
        "mainContent": {
          templateUrl: "app/movie/movie.html"
        }
      },
      params: {
        top10: false,
        previousTitle: null,
        imdbId: null
      }
    })

    .state('home.genreMovie', {
        url: "/genres/genreMovie/:movieName",
        views: {
          "mainContent": {
            templateUrl: "app/genres/genreMovie.html"
          }
        },
        params: {
          genre: null,
          previousTitle: null,
          imdbId: null
        }
      })

    .state('home.genreMovieList', {
      url: "/genres/genreMovieList",
      cache: false,
      views: {
        "mainContent": {
          templateUrl: "app/genres/genreMovieList.html"
        }
      },
      params: {
        genre: null
      }
    })

    .state('home.recentlyAddedList', {
      url: "/recentlyAdded/recentlyAddedList",
      views: {
        "mainContent": {
          templateUrl: "app/recentlyAdded/recentlyAddedList.html"
        }
      }
    })

    .state('home.recentlyAddedMovie', {
      url: "/recentlyAdded/recentlyAddedMovie/:movieName",
      views: {
        "mainContent": {
          templateUrl: "app/recentlyAdded/recentlyAddedMovie.html"
        }
      },
      params: {
        previousTitle: null,
        imdbId: null,
        previousImdbId: null
      }
    })

    .state('home.top10', {
      url: "/top10",
      views: {
        "mainContent": {
          templateUrl: "app/top10Movies/top10.html"
        }
      }
    })

    .state('home.genres', {
      url: "/genres",
      views: {
        "mainContent": {
          templateUrl: "app/genres/genres.html"
        }
      }
    })

    .state('home.watchlist', {
      cache: false,
      url: "/watchlist",
      views: {
          "mainContent": {
              templateUrl: "app/watchlist/watchlist.html"
          }
      }
    })

    .state('home.movieDay', {
      url: "/movieDay",
      views: {
        "mainContent": {
          templateUrl: "app/home/movieDay.html"
        }
      }
    });

  $urlRouterProvider.otherwise('/home/movieDay');
});
