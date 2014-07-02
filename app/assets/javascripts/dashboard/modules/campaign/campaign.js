'use strict';
var campaign = angular.module('campaign', []);

// LIST
campaign.controller('Campaigns.List',
function ($scope, $location, campaigns, CampaignAPI) {
  $scope.listCampaigns = campaigns;

  $scope.show = function (campaign) {
    $location.path('/campaigns/' + campaign.id);
  };

  $scope.edit = function (campaign) {
    CampaignAPI.put(campaign);
  };

  $scope.remove = function (campaign) {
    CampaignAPI.remove(campaign);
  };
});


// NEW & EDIT
campaign.controller('Campaigns.New-Edit',
function ($scope, $location, $filter,
CampaignAPI, campaign, advertisers, pacing) {
  var dateFilter = $filter('date');

  $scope.today = new Date();
  $scope.campaign = campaign;
  $scope.pacingType = pacing.type;
  $scope.pacingTypes = pacing.types;
  $scope.campaign.dollar_budget = +campaign.dollar_budget;
  $scope.advertisers = [];

  _(advertisers).each(function (advertiser) {
    $scope.advertisers.push({
      name: advertiser.name,
      id: advertiser.id
    });
  });

  $scope.submit = function (campaign) {
    var httpMethod = campaign.id ? 'put' : 'post';
    campaign.start_date = dateFilter(campaign.start_date, 'yyyy-MM-dd');
    campaign.end_date = dateFilter(campaign.end_date, 'yyyy-MM-dd');
    campaign.advertiser = _($scope.advertisers).findWhere({id: campaign.advertiser_id});
    CampaignAPI[httpMethod](campaign).then(function (camp) {
      $location.path('/campaigns/' + camp.id);
    });
  };
});


// SHOW
campaign.controller('Campaigns.Show',
function ($q, $scope, $location, campaign, lineItems, LineItemAPI, sparklineData) {
  $scope.campaign  = campaign;
  $scope.lineItems = lineItems;
  $scope.shownChart = 'CTR';
  $scope.trailingWeek = {
    data: sparklineData
  };

  $scope.show = function (lineItem) {
    $location.path('/line-items/' + lineItem.id);
  };

  $scope.edit = function (lineItem) {
    LineItemAPI.put(lineItem);
  };

  $scope.remove = function (lineItem) {
    LineItemAPI.remove(lineItem)
    .then(function (removedLineItem) {
      var index = $scope.lineItems.indexOf(lineItem);
      $scope.lineItems.splice(index, 1);
    });
  };
});
