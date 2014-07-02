app.factory('CampaignAPI',
function (Restangular, $http, $location, $timeout, $q, baseUrl, StaticData, $alert) {
  var campaigns = Restangular.all('campaigns');
  var cachedCampaigns = [];

  return {
    _sync: function () {
      var deferred = $q.defer();
      $http.get(baseUrl + '/campaigns')
      .success(function (campaigns) {
        cachedCampaigns = campaigns;
        deferred.resolve(cachedCampaigns);
      });
      return deferred.promise;
    },
    getList: function () {
      var deferred = $q.defer();
      if (!cachedCampaigns.length) {
        this._sync().then(function (campaigns) {
          deferred.resolve(campaigns);
        });
        return deferred.promise;
      } else {
        return cachedCampaigns;
      }
    },
    getCampaign: function (id) {
      var deferred = $q.defer();
      if (!cachedCampaigns.length) {
        this._sync().then(function (campaigns) {
          deferred.resolve(_(campaigns).findWhere({id: id}));
        });
        return deferred.promise;
      } else {
        return _(cachedCampaigns).findWhere({id: id});
      }
    },

    post: function (campaign) {
      var deferred = $q.defer();

      var advertiser = campaign.advertiser;
      delete campaign.advertiser;

      Restangular.setFullResponse(true);
      campaigns.post(campaign)
      .then(
        // Success
        function (res) {
          var id = res.headers().location.split('/campaigns/')[1];
          cachedCampaigns.push({
            id: +id,
            status: 'active',
            name: campaign.name,
            start_date: campaign.start_date,
            end_date: campaign.end_date,
            advertiser_id: campaign.advertiser_id,
            advertiser: advertiser,
            pacing_type: campaign.pacing_type,
            imp_budget: campaign.imp_budget,
            dollar_budget: campaign.dollar_budget,
            imps: 0,
            clicks: 0,
            ctr: '0.0000%'
          });
          deferred.resolve(_(cachedCampaigns).last());
        },
        // Error
        function (err) {
          $alert(StaticData.growl({
            type: 'danger',
            title: 'Notice',
            message: 'Failed to save campaign.'
          }));
        }
      );
      return deferred.promise;
    },
    put: function (campaign) {
      var _this = this;
      var deferred = $q.defer();
      Restangular.one('campaigns', +campaign.id).patch(campaign)
      .then(function () {
        // Update cache
        _this._sync().then(function (campaigns) {
          deferred.resolve(_(campaigns).findWhere({id: +campaign.id}));
        });
        // Delay growl (for effect)
        $timeout(function () {
          $alert(StaticData.growl({
            type: 'success',
            title: 'Success',
            message: 'Campaign updated.'
          }));
        }, 250);
      });
      return deferred.promise;
    },
    remove: function (campaign) {
      Restangular.one('campaigns', campaign.id).remove()
      .then(function () {
        var index = cachedCampaigns.indexOf(campaign);
        cachedCampaigns.splice(index, 1);
        $alert(StaticData.growl({
          type: 'success',
          title: 'Success',
          message: 'Campaign deleted.'
        }));
      });
    }
  };
});
