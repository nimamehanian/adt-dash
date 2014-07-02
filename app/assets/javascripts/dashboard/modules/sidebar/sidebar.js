'use strict';
angular.module('sidebar', [])

// Modal config
.config(function ($modalProvider) {
  angular.extend($modalProvider.defaults, {
    container: 'body',
    placement: 'center',
    animation: 'animation-fadeAndScale',
    html: true,
    show: true
  });
})

.controller('Sidebar.Root', function ($scope) {
  $scope.sidebarLinks = [];
})

.controller('Sidebar.Library', function ($scope) {
  $scope.sidebarLinks = [];
})

.controller('Sidebar.Analytics', function ($scope) {
  $scope.sidebarLinks = [];
})

.controller('Sidebar.Campaigns.List', function ($scope) {
  $scope.sidebarLinks = [
    {name: 'Begin Campaign', domId: 'new-campaign', icon: 'icon-plus', route: '/campaigns/new'}
  ];
})

.controller('Sidebar.Campaigns.New', function ($scope) {
  $scope.sidebarLinks = [];
})

.controller('Sidebar.Campaigns.Show', function ($scope, $stateParams, $timeout, $alert, $aside, $modal, $upload, campaign, StaticData, baseUrl, Dma) {
  var id = $stateParams.campaignId;
  $scope.sidebarLinks = [
    {name: 'Create Line Item', domId: 'new-line-item',   icon: 'icon-plus', route: '/campaigns/' + id + '/line-items/new'},
    {name: 'Edit Campaign',    domId: 'edit-campaign',   icon: 'icon-edit', route: '/campaigns/' + id + '/edit'},
    {name: 'Campaign Details', domId: 'trigger-details', icon: 'icon-info', route: ''},
    {name: 'Upload Media', domId: 'upload-media', icon: 'icon-microphone', route: ''},
    {name: 'Upload a TV Schedule', domId: 'upload-schedule', icon: 'icon-calendar', route: ''}
  ];

  $scope.dma = '';
  $scope.dmas = Dma.list;
  $scope.dmaDesc = [];


  $scope.asset = {
    name: '',
    brand: ''
  };

  $scope.schedule = {
    name: '',
    description: '',
    dma: []
  };

  $scope.submitMedia = function (media) {
    console.log(media);
  };

  $scope.submitSchedule = function (schedule) {
    console.log(schedule);
  };

  $scope.mediaFileSelect = function (asset, hideModal) {
    $scope.assetName = asset[0].name;

    $scope.upload = $upload.upload({
      // File to upload
      file: asset[0],

      // Location to POST
      url: baseUrl + '/creatives',

      // JSON container
      fileFormDataName: 'creative[uploaded]',

      // Additional data to send with it
      data: { creative: $scope.asset },

      // TODO: Refactor/Inspect...
      // 'key' is 'creative', from 'data' property.
      formDataAppender: function (formData, key, values) {
        _(values).each(function (v, k) {
          formData.append(key + '[' + k + ']', v);
        });
      }
    })
    .success(function (data, status, headers, config) {
      $scope.showMediaProgressBar = true;
      $timeout(function () {
        hideModal();
      }, 1000);
    })
    .error(function () {
      $alert(StaticData.growl({
        type: 'warning',
        title: 'Notice',
        message: 'This media asset is already in your library.'
      }));
    });
  };

  $scope.scheduleFileSelect = function (schedule, hideModal) {
    $scope.showScheduleProgressBar = true;
    $timeout(function () {
      hideModal();
    }, 3000);
  };

  $scope.removeDMA = function (dma) {
    var code = dma.match(/\d{3}/)[0];
    var desc = _(Dma.list).findWhere({code: +code}).name;

    var modelIndex = $scope.schedule.dma.indexOf(code);
    var descIndex  = $scope.dmaDesc.indexOf(desc);

    $scope.schedule.dma.splice(modelIndex, 1);
    $scope.dmaDesc.splice(descIndex, 1);

    $alert(StaticData.growl({
      type: 'info',
      title: 'Notice',
      message: 'DMA removed.'
    }));
  };

  $scope.trigger = function (e, className) {
    if (className === 'trigger-details') {
      this._showDetails(e, className);
    } else if (className === 'upload-media') {
      this._uploadMedia(e, className);
    } else if (className === 'upload-schedule') {
      this._uploadSchedule(e, className);
    } else {
      return;
    }
  };

  $scope._showDetails = function (e, className) {
    $aside({
      animation: 'animation-fadeAndSlideLeft',
      title: 'Campaign Details',
      content: StaticData.campaignDetailsTemplate(campaign),
      placement: 'left',
      trigger: 'click',
      html: true,
      show: true
    });
  };

  $scope._uploadMedia = function (e, className) {
    $modal({
      title: ' ',
      scope: $scope,
      template: 'uploadMedia.tpl.html'
    });
  };

  $scope._uploadSchedule = function (e, className) {
    $modal({
      title: ' ',
      scope: $scope,
      template: 'uploadSchedule.tpl.html'
    });
  };
})

.controller('Sidebar.Campaigns.Edit', function ($scope, $stateParams) {
  var id = $stateParams.campaignId;
  $scope.sidebarLinks = [];
})

.controller('Sidebar.LineItems.New', function ($scope) {
  $scope.sidebarLinks = [];
})

.controller('Sidebar.LineItems.Show', function ($scope, $aside, $stateParams, lineitemInstance, StaticData) {
  var id = $stateParams.lineitemId;
  $scope.sidebarLinks = [
    {name: 'Edit Line Item',    domId: 'edit-line-item',  icon: 'icon-edit', route: '/line-items/' + id + '/edit'},
    {name: 'Line Item Details', domId: 'trigger-details', icon: 'icon-info', route: ''}
  ];

  $scope.trigger = function (e, className) {
    if (className === 'trigger-details') {
      this._showDetails(e, className);
    } else {
      return;
    }
  };

  $scope._showDetails = function (e, className) {
    $aside({
      animation: 'animation-fadeAndSlideLeft',
      title: 'Line Item Details',
      content: StaticData.lineItemDetailsTemplate(lineitemInstance),
      placement: 'left',
      trigger: 'click',
      html: true,
      show: true
    });
  };
})

.controller('Sidebar.LineItems.Edit', function ($scope) {
  $scope.sidebarLinks = [];
});
