'use strict';
var advertiser = angular.module('advertiser', []);

advertiser.factory('AdvertiserAPI', function ($http, $q, baseUrl) {
  var cachedAdvertisers = [];

  return {
    _sync: function () {
      var deferred = $q.defer();
      $http.get(baseUrl + '/advertisers')
      .success(function (advertisers) {
        deferred.resolve(advertisers);
      });
      return deferred.promise;
    },
    getList: function () {
      var deferred = $q.defer();
      if (!cachedAdvertisers.length) {
        this._sync().then(function (advertisers) {
          cachedAdvertisers = [];
          _(advertisers).each(function (adv) {
            cachedAdvertisers.push({id: adv.id, name: adv.name});
          });
          deferred.resolve(cachedAdvertisers);
        });
        return deferred.promise;
      } else {
        return cachedAdvertisers;
      }
    }
  };
});
