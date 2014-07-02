lineitem.factory('LineItemAdAPI',
function ($q, LineItemAPI) {

  return {
    post: function (params) {
      var deferred = $q.defer();
      var suppressGrowl = true;
      var lineItemAd = params.lineItemAd;
      var lineItemId = params.lineItemId;

      // Get lineItem from cache
      var lineItem = LineItemAPI.getLineItem(lineItemId);

      // Update its ads
      lineItem.ads_attributes = [lineItemAd];

      // Resubmit
      LineItemAPI.put(lineItem, suppressGrowl)
      .then(function () {
        // Update cache
        LineItemAPI._sync().then(function () {
          var li = LineItemAPI.getLineItem(lineItemId);
          deferred.resolve(li);
        });
      });
      return deferred.promise;
    },
    put: function (params) {
      var deferred = $q.defer();
      this.post(params).then(function (li) {
        deferred.resolve(li);
      });
      return deferred.promise;
    }
  };
});
