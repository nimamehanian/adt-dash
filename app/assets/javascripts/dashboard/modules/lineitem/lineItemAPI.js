lineitem.factory('LineItemAPI',
function (Restangular, CampaignAPI, $http, $location, $timeout, $q, baseUrl, StaticData, $alert) {
  var lineitems = Restangular.all('line_items');
  var cachedLineItems = [];
  var cachedReports   = {};

  return {
    _sync: function () {
      var deferred = $q.defer();
      $http.get(baseUrl + '/line_items')
      .success(function (lineItems) {
        cachedLineItems = lineItems;
        deferred.resolve(cachedLineItems);
      });
      return deferred.promise;
    },
    _syncReporting: function (lid) {
      var deferred = $q.defer();
      var impsServedThusFar = 0;
      var day = 0;
      var modifiedChartData = [];
      $http.get(baseUrl + '/line_items/' + lid + '/report')
      .success(function (reporting) {
        _(reporting.data).each(function (datum) {
          impsServedThusFar += datum.imps;
          modifiedChartData.push({
            day: day += 1,
            date: datum.date,
            imps: datum.imps,
            clicks: datum.clicks,
            ctr: +datum.ctr.toPrecision(3),
            impsServedThusFar: impsServedThusFar
          });
        });
        cachedReports[lid] = modifiedChartData;
        deferred.resolve(cachedReports[lid]);
      });
      return deferred.promise;
    },
    getReporting: function (lineitemId) {
      var deferred = $q.defer();
      var lid = String(lineitemId);
      if (!cachedReports[lid] || !cachedReports[lid].length) {
        this._syncReporting(lid).then(function (report) {
          deferred.resolve(report);
        });
      } else {
        deferred.resolve(cachedReports[lid]);
      }
      return deferred.promise;
    },
    getList: function (campaignId) {
      var deferred = $q.defer();
      if (!cachedLineItems.length) {
        this._sync().then(function (lineItems) {
          deferred.resolve(_(lineItems).where({campaign_id: campaignId}));
        });
      } else {
        deferred.resolve(_(cachedLineItems).where({campaign_id: campaignId}));
      }
      return deferred.promise;
    },
    getLineItem: function (id) {
      var deferred = $q.defer();
      if (!cachedLineItems.length) {
        this._sync().then(function (lineItems) {
          deferred.resolve(_(lineItems).findWhere({id: id}));
        });
        return deferred.promise;
      } else {
        return _(cachedLineItems).findWhere({id: id});
      }
    },
    post: function (lineitem) {
      var deferred = $q.defer();
      Restangular.setFullResponse(true);
      lineitems.post(lineitem)
      .then(
        // Succcess
        function (res) {
          var id = res.headers().location.split('/line_items/')[1];
          var campaign = CampaignAPI.getCampaign(lineitem.campaign_id);
          cachedLineItems.push(_.extend(lineitem, {
            id: +id, campaign: campaign,
            imps: 0, clicks: 0, progress: 0,
            ctr: '0.0000%', status: 'running'
          }));
          deferred.resolve(_(cachedLineItems).last());
        },
        // Error
        function (err) {
          $alert(StaticData.growl({
            type: 'danger',
            title: 'Notice',
            message: 'Failed to save line item.'
          }));
        }
      );
      return deferred.promise;
    },
    put: function (li, suppressGrowl) {
      var _this = this;
      var deferred = $q.defer();
      Restangular.one('line_items', +li.id).patch({line_item: li})
      .then(function () {
        // Update cache
        _this._sync().then(function (lineItems) {
          deferred.resolve(_(lineItems).findWhere({id: +li.id}));
        });
        // Delay growl (for effect)
        if (!suppressGrowl) {
          $timeout(function () {
            $alert(StaticData.growl({
              type: 'success',
              title: 'Success',
              message: 'Line item updated.'
            }));
          }, 250);
        }
      });
      return deferred.promise;
    },
    remove: function (lineitem) {
      var index, removedLineItem;
      var deferred = $q.defer();
      Restangular.one('line_items', lineitem.id).remove()
      .then(function () {
        index = cachedLineItems.indexOf(lineitem);
        removedLineItem = cachedLineItems.splice(index, 1);
        deferred.resolve(removedLineItem);
        $alert(StaticData.growl({
          type: 'success',
          title: 'Success',
          message: 'Line Item deleted.'
        }));
      });
      return deferred.promise;
    }
  };
});
