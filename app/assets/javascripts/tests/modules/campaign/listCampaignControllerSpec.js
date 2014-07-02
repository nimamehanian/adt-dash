'use strict';
describe('The Campaigns.List controller', function () {
  var $scope, $controllerConstructor, mockedCampaignAPI;
  var campaign = {id: 1, advertiser_id: 1, name: 'Cool Campaign'};
  beforeEach(module('campaign'));
  beforeEach(inject(function ($controller, $rootScope) {
    $scope = $rootScope.$new();
    $controllerConstructor = $controller;
    mockedCampaignAPI = sinon.stub({
      getList: function () {},
      put: function () {},
      remove: function () {}
    });
  }));


  describe('$scope.listCampaigns() method', function () {
    it('holds the result of CampaignAPI.getList()', function () {
      var mockedCampaigns = [];
      var controller = $controllerConstructor('Campaigns.List', {
        $scope: $scope,
        CampaignAPI: mockedCampaignAPI
      });

      mockedCampaignAPI.getList.returns(mockedCampaigns);

      expect($scope.listCampaigns()).toBe(mockedCampaigns);
    });
  });


  describe('$scope.show() method', function () {
    it('navigates to a campaign\'s `show` page', function () {
      var campaign = {id: 27};
      var mocked$location = sinon.stub({ path: function () {} });
      var controller = $controllerConstructor('Campaigns.List', {
        $scope: $scope,
        $location: mocked$location,
        CampaignAPI: mockedCampaignAPI
      });

      $scope.show(campaign);

      expect(mocked$location.path.calledWith('/campaigns/27')).toBe(true);
    });
  });


  describe('$scope.edit() method', function () {
    it('calls CampaignAPI.put(), once, with a campaign instance', function () {
      var spiedPut = spyOn(mockedCampaignAPI, 'put');
      var controller = $controllerConstructor('Campaigns.List', {
        $scope: $scope,
        CampaignAPI: mockedCampaignAPI
      });

      $scope.edit(campaign);

      expect(spiedPut.calls.count()).toEqual(1);
      expect(spiedPut).toHaveBeenCalledWith(campaign);
    });
  });


  describe('$scope.remove() method', function () {
    it('calls CampaignAPI.remove(), once, with a campaign instance', function () {
      var spiedRemove = spyOn(mockedCampaignAPI, 'remove');
      var controller = $controllerConstructor('Campaigns.List', {
        $scope: $scope,
        CampaignAPI: mockedCampaignAPI
      });

      $scope.remove(campaign);

      expect(spiedRemove.calls.count()).toEqual(1);
      expect(spiedRemove).toHaveBeenCalledWith(campaign);
    });
  });
});
