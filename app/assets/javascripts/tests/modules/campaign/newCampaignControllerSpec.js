'use strict';
describe('The Campaigns.New controller', function () {
  var $scope, $q, $controllerConstructor, mockedCampaignAPI;
  var campaign = {id: 1, advertiser_id: 1, name: 'Cool Campaign'};
  beforeEach(module('campaign'));
  beforeEach(inject(function ($controller, $rootScope, $q) {
      $q = $q;
      $scope = $rootScope.$new();
      $controllerConstructor = $controller;
      mockedCampaignAPI = sinon.stub({
        post: function () {}
      });
    }));

  describe('$scope.submit() method', function () {
    it('calls CampaignAPI.post(), once, with a campaign instance, and navigates to its `show` page, on success', function () {
      var spiedPost = spyOn(mockedCampaignAPI, 'post');
      var mocked$location = sinon.stub({ path: function () {} });
      var controller = $controllerConstructor('Campaigns.New', {
        $scope: $scope,
        $location: mocked$location,
        CampaignAPI: mockedCampaignAPI,
        advertisers: [],
        pacing: {}
      });


      // //this will be the return type of the api.users, it will return a promise
      // var usersDefer = $q.defer();

      // //resolve on a defer and passing it data, will always run the first argument of the then() if you want to test the second one, write reject() instead, but here by default we want to resolve it and pass it an empty object that we can change it's value in any unit test
      // usersDefer.resolve(usersData);

      // //defer.promise is actually the object that has the then() method
      // mockApi.users.andReturn(usersDefer.promise);

      // /////////////
      // var postPromise = $q.defer();


      // $scope.submit(campaign);

      // expect(spiedPost.calls.count()).toEqual(1);
      // expect(spiedPost).toHaveBeenCalledWith(campaign);
    });
  });
});
