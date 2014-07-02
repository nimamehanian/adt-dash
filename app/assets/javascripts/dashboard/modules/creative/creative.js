'use strict';
angular.module('creative', [])

.factory('CreativeAPI', function (Restangular, $q) {
  return {
    post: function (creative) {
      var deferred = $q.defer();
      Restangular.setFullResponse(true);
      Restangular.all('creatives').post(creative)
      .then(function (res) {
        var id = res.headers().location.split('/creatives/')[1];
        creative.id = Number(id);
        deferred.resolve(creative);
      });
      return deferred.promise;
    }
    // For ad library:
    // , getList: function () {

    // }
  };
});
