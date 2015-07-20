(function () {
  'use strict';

  angular.module('movieApp').factory('moviesApi', ['$http', '$q', '$ionicLoading', 'CacheFactory', moviesApi]);

  function moviesApi($http, $q, $ionicLoading, CacheFactory) {

    var apiHost = "https://streamsidekick-api.herokuapp.com";

    self.moviesCache = CacheFactory.get('moviesCache');
    self.topRatedMovies = CacheFactory.get('topRatedMovies');
    self.genreMovies = CacheFactory.get('genreMovies');
    self.recentlyAddedMovies = CacheFactory.get('recentlyAddedMovies');

    this.movies = this.movies || [];

    function getMovies () {
      var deferred = $q.defer();

      $http.get(apiHost + '/api/amazonPrime/movies/')
      .success(function (data, status) {
        if (status === 200) {
          data.forEach(function (movie) {
            if (!self.moviesCache.get(movie.imdbId)) {
              self.moviesCache.put(movie.imdbId, movie);
            }
          });
          deferred.resolve(data);
        } else {
          deferred.reject(status);
        }
      })
      .error(function (err) {
        deferred.reject(err);
      });
      return deferred.promise;
    }

    function getTop10Movies() {
      var deferred = $q.defer(),
          top10Movies = self.topRatedMovies.get('top10Movies');

      if (top10Movies) {
        deferred.resolve(top10Movies);
      } else {
        $http.get(apiHost + '/api/amazonPrime/movies/top/50')
            .success(function (data, status) {
              self.topRatedMovies.put('top10Movies', data);
              deferred.resolve(data);
            })
            .error(function (err) {
          deferred.reject(err);
        });
      }
      return deferred.promise;
    }

    function getMoviesByGenre(genre) {
        var deferred = $q.defer(),
            genreKey = genre,
            genreMovies = self.genreMovies.get(genreKey);
        if (genreMovies) {
          deferred.resolve(genreMovies);
        } else {
          $http.get(apiHost + '/api/amazonPrime/movies/' + genre + '/top/100')
            .success(function (data, status) {
                self.genreMovies.put(genre, data);
                deferred.resolve(data);
            })
            .error(function (err) {
                deferred.reject(err);
            })
        }

      return deferred.promise;
    }

    function getRecentlyAddedMovies() {
      var deferred = $q.defer(),
          recentlyAddedMovies = self.recentlyAddedMovies.get('recentlyReleased');
      if (recentlyAddedMovies) {
        deferred.resolve(recentlyAddedMovies);
      } else {
        $http.get(apiHost + '/api/amazonPrime/movies/recentlyAdded')
          .success(function (data, status) {
            self.recentlyAddedMovies.put('recentlyReleased', data);
            deferred.resolve(data);
          })
          .error(function (err) {
              deferred.reject(err);
          })
      }

      return deferred.promise;
    }

    function getRecentlyAddedMovieByIndex(index) {
      var deferred = $q.defer();
      getRecentlyAddedMovies().then(function (response) {
        deferred.resolve(response[index]);
      });
      return deferred.promise;
    }

    function getMovieByGenreAndIndex(genre, index) {
      var deferred = $q.defer();
      getMoviesByGenre(genre).then(function (response) {
        deferred.resolve(response[index]);
      });
      return deferred.promise;
    }

    function getGenreMoviesCount(genre) {
      var deferred = $q.defer();
      getMoviesByGenre(genre).then(function (response) {
        deferred.resolve(response.length);
      });
      return deferred.promise;
    }

    function getRecentlyAddedMoviesCount() {
      var deferred = $q.defer();
      getRecentlyAddedMovies().then(function (response) {
        deferred.resolve(response.length);
      });
      return deferred.promise;
    }

    function getMovieById(movieId) {
      return _.find(movies.top10Movies.movies, function (movie) {
        return movie.id === parseInt(movieId);
      });
    }

    function getMovieByImdbId(movieImdbId) {
      return _.find(movies.top10Movies.movies, function (movie) {
        return movie.movieImdbId === parseInt(movieImdbId);
      });
    }

    function getMovieByIndex(index) {
      var deferred = $q.defer();
      getTop10Movies().then(function (response) {
        deferred.resolve(response[index]);
      });
      return deferred.promise;
    }

    function getMovieDataByTitle(movieTitle) {
      var deferred = $q.defer(),
          movieData = self.moviesCache.get(movieTitle);
      if (movieData) {
        deferred.resolve(movieData);
      } else {
        console.log('movie cant be found');
        deferred.reject();
      }
      return deferred.promise;
    }

    function getMovieDataByImdbId(imdbId) {
      var deferred = $q.defer(),
          movieData = self.moviesCache.get(imdbId);
      if (movieData) {
        deferred.resolve(movieData);
      } else {
        getMovies().then(function (data) {
          if (data.length > 0) {
            deferred.resolve(getMovieByImdbId(data));
          }
        });
        deferred.reject('no movie found');
      }
      return deferred.promise;
    }

    function getAllMovieData() {
      var _this = this;
      if (!self.moviesCache || !self.topRatedMovies || !self.genreMovies || !self.recentlyAddedMovies) {
        setTimeout(function () {
          getAllMovieData();
          console.log('trying again');
        }, 200);
      } else {
        getRecentlyAddedMovies();
        getTop10Movies();
        getMovies().then(function (data) {
          console.log('got movies', data);
          _this.movies = data;
        });
      }
    }

    return {
      getTop10Movies: getTop10Movies,
      getMovieById: getMovieById,
      getMovieByImdbId: getMovieByImdbId,
      getMovieByIndex: getMovieByIndex,
      getMovieDataByTitle: getMovieDataByTitle,
      getMovieDataByImdbId: getMovieDataByImdbId,
      getMoviesByGenre: getMoviesByGenre,
      getMovieByGenreAndIndex: getMovieByGenreAndIndex,
      getGenreMoviesCount: getGenreMoviesCount,
      getRecentlyAddedMovies: getRecentlyAddedMovies,
      getRecentlyAddedMoviesCount: getRecentlyAddedMoviesCount,
      getRecentlyAddedMovieByIndex: getRecentlyAddedMovieByIndex,
      getAllMovieData: getAllMovieData
    };
  }
})();
