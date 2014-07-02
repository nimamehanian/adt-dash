app.config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
  var sidebarTemplateUrl = '/assets/dashboard/modules/sidebar/templates/sidebarLinks.html';

  $locationProvider.html5Mode(true);
  $stateProvider
  .state('root', {
    url: '/',
    views: {
      'sidebar': {
        templateUrl: sidebarTemplateUrl,
        controller: 'Sidebar.Root'
      }
    }
  })

  // Campaigns
  .state('campaigns', {
    url: '/campaigns',
    views: {
      'sidebar': {
        templateUrl: sidebarTemplateUrl,
        controller: 'Sidebar.Campaigns.List'
      },
      'main': {
        templateUrl: '/assets/dashboard/modules/campaign/templates/listCampaigns.html',
        controller: 'Campaigns.List'
      }
    },
    resolve: {
      campaigns: function (CampaignAPI) { return CampaignAPI.getList(); },
      advertisers: function (AdvertiserAPI) { return AdvertiserAPI.getList(); },
      pacing: function (StaticData) { return { type: '', types: StaticData.pacingTypes }; }
    }
  })

  // Campaigns.New
  .state('campaigns.new', {
    url: '/new',
    views: {
      'sidebar@': {
        templateUrl: sidebarTemplateUrl,
        controller: 'Sidebar.Campaigns.New'
      },
      'main@': {
        templateUrl: '/assets/dashboard/modules/campaign/templates/newCampaign.html',
        controller: 'Campaigns.New-Edit'
      }
    },
    resolve: {
      campaign: function () { return {}; },
      advertisers: function (advertisers) { return advertisers; },
      pacing: function (pacing) { return pacing; }
    }
  })

  // Campaigns.Edit
  .state('campaigns.edit', {
    url: '/:campaignId/edit',
    views: {
      'sidebar@': {
        templateUrl: sidebarTemplateUrl,
        controller: 'Sidebar.Campaigns.Edit'
      },
      'main@': {
        templateUrl: '/assets/dashboard/modules/campaign/templates/editCampaign.html',
        controller: 'Campaigns.New-Edit'
      }
    },
    resolve: {
      campaign: function ($stateParams, CampaignAPI) {
        var id = +$stateParams.campaignId;
        return CampaignAPI.getCampaign(id);
      },
      advertisers: function (advertisers) { return advertisers; },
      pacing: function (pacing) { return pacing; }
    }
  })

  // Campaigns.Show
  .state('campaigns.show', {
    url: '/:campaignId',
    views: {
      'sidebar@': {
        templateUrl: sidebarTemplateUrl,
        controller: 'Sidebar.Campaigns.Show'
      },
      'main@': {
        templateUrl: '/assets/dashboard/modules/campaign/templates/showCampaign.html',
        controller: 'Campaigns.Show'
      }
    },
    resolve: {
      campaign: function ($stateParams, CampaignAPI) {
        var id = +$stateParams.campaignId;
        return CampaignAPI.getCampaign(id);
      },
      lineItems: function ($stateParams, LineItemAPI) {
        var id = +$stateParams.campaignId;
        return LineItemAPI.getList(id);
      },
      sparklineData: function ($q, $stateParams, SparklineAPI) {
        var campaignId = +$stateParams.campaignId;
        return SparklineAPI.getReporting(campaignId);
      }
    }
  })


  // LineItems.New
  .state('campaigns.show.lineitems:new', {
    url: '/line-items/new',
    views: {
      'sidebar@': {
        templateUrl: sidebarTemplateUrl,
        controller: 'Sidebar.LineItems.New'
      },
      'main@': {
        templateUrl: '/assets/dashboard/modules/lineitem/templates/newLineItem.html',
        controller: 'LineItems.New-Edit'
      }
    },
    resolve: {
      campaign: function (campaign) { return campaign; },
      lineitemInstance: function ($stateParams) {
        var id = +$stateParams.campaignId;
        return {
          campaign_id: id,
          target_app_names: [],
          target_geo_dmas: [],
          target_geo_timezones: [],
          target_device_oses: [],
          tv_strategy: 'amplify',
          target_dayparts: {
            timezone: 'Local',
            daysofweek: {
              sunday: [],
              monday: [],
              tuesday: [],
              wednesday: [],
              thursday: [],
              friday: [],
              saturday: []
            }
          }
        };
      }
    }
  })

  // LineItems.Show
  .state('lineitems:show', {
    url: '/line-items/:lineitemId',
    views: {
      'sidebar': {
        templateUrl: sidebarTemplateUrl,
        controller: 'Sidebar.LineItems.Show'
      },
      'main': {
        templateUrl: '/assets/dashboard/modules/lineitem/templates/showLineItem.html',
        controller: 'LineItems.Show'
      }
    },
    resolve: {
      lineitemInstance: function ($stateParams, LineItemAPI) {
        var id = +$stateParams.lineitemId;
        return LineItemAPI.getLineItem(id);
      },
      adver: function (AdvertiserAPI) {
        return AdvertiserAPI.getList();
      },
      chartData: function ($stateParams, LineItemAPI) {
        var id = +$stateParams.lineitemId;
        return LineItemAPI.getReporting(id);
      }
    }
  })

  // LineItems.Edit
  .state('lineitems:show.lineitems:edit', {
    url: '/edit',
    views: {
      'sidebar@': {
        templateUrl: sidebarTemplateUrl,
        controller: 'Sidebar.LineItems.Edit'
      },
      'main@': {
        templateUrl: '/assets/dashboard/modules/lineitem/templates/editLineItem.html',
        controller: 'LineItems.New-Edit'
      }
    },
    resolve: {
      campaign: function ($stateParams, CampaignAPI) {
        var id = +$stateParams.campaignId;
        return CampaignAPI.getCampaign(id);
      },
      lineitemInstance: function (lineitemInstance) { return lineitemInstance; }
    }
  })

  // Library and Analytics
  .state('library', {
    url: '/library',
    views: {
      'sidebar': {
        templateUrl: sidebarTemplateUrl,
        controller: 'Sidebar.Library'
      },
      'main': {
        templateUrl: '/assets/dashboard/modules/library/templates/library.html',
        controller: 'Library'
      }
    }
  })
  .state('analytics', {
    url: '/analytics',
    views: {
      'sidebar': {
        templateUrl: sidebarTemplateUrl,
        controller: 'Sidebar.Analytics'
      },
      'main': {
        templateUrl: '/assets/dashboard/modules/analytics/templates/analytics.html',
        controller: 'Analytics'
      }
    }
  });
});
