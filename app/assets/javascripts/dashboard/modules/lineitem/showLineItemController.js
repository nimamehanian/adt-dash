lineitem.controller('LineItems.Show',
function (StaticData, $scope, $upload, $stateParams, $timeout,
$alert, baseUrl, adver, lineitemInstance,
LineItemAPI, LineItemAdAPI, CreativeAPI, chartData) {

  $scope.advertisers = adver;
  $scope.lineItem    = lineitemInstance;
  $scope.lineItemAds = lineitemInstance.ads;
  $scope.imageAd     = _.extend({}, StaticData.imageAd);
  $scope.htmlAd      = _.extend({}, StaticData.htmlAd);
  $scope.lineItemAd  = _.extend({}, StaticData.lineItemAd);

  // $scope.itp         = '';
  // $scope.itps        = [];

  $scope.wizardSteps = StaticData.wizardSteps;
  $scope.currentStep = 0;
  $scope.prevStep;

  $scope.reporting = { data: chartData };
  $scope.shownChart = 'CTR';

  $scope.comingFromStep = function (step) {
    $scope.prevStep = step;
  };

  $scope.goBack = function () {
    switch ($scope.prevStep) {
      case 0: return $scope.setCurrentStep(0);
      case 1: return $scope.setCurrentStep(1);
      case 3: return $scope.setCurrentStep(3);
    }
  };

  $scope.htmlAdModal  = StaticData.htmlAdModal;
  $scope.imageAdModal = StaticData.imageAdModal;
  $scope.previewAd    = StaticData.previewAd;
  $scope.editAd       = StaticData.editAd;
  $scope.libraryModal = StaticData.libraryModal;

  $scope.getTitle = function () {
    return StaticData.getTitle($scope.currentStep);
  };

  $scope.getCurrentStepName = function () {
    return $scope.wizardSteps[$scope.currentStep];
  };

  $scope.setCurrentStep = function (step) {
    $scope.currentStep = step;
  };

  $scope.setAdFormat = function (params) {
    $scope.htmlAd.format = StaticData.setAdFormat(params);
  };

  // i.e., uploadImageAd
  $scope.onFileSelect = function (images) {
    $scope.creativeName = images[0].name;

    $scope.upload = $upload.upload({
      file: images[0],
      url: baseUrl + '/creatives',
      fileFormDataName: 'creative[uploaded]',
      data: {creative: $scope.imageAd},
      // 'key' is 'creative', from 'data' property.
      formDataAppender: function (formData, key, values) {
        _(values).each(function (v, k) {
          formData.append(key + '[' + k + ']', v);
        });
      }
    })
    .success(function (data, status, headers, config) {
      $scope.showBar = true;
      var creative_id = headers().location.split('/creatives/')[1];
      $scope.lineItemAd.creative_id = creative_id;
      $scope.lineItemAd.name = $scope.creativeName;
      $timeout(function () {
        $scope.setCurrentStep(2);
      }, 1000);
    })
    .error(function () {
      $alert(StaticData.growl({
        type: 'warning',
        title: 'Notice',
        message: 'This ad is already in your library.'
      }));
    });
  };

  $scope.uploadHtmlAd = function () {
    $scope.setAdFormat({
      width: $scope.htmlAd.width,
      height: $scope.htmlAd.height
    });

    CreativeAPI.post($scope.htmlAd)
    .then(function (creative) {
      // Progress wizard to Line Item Ad form view,
      // and set the ID from the uploaded creative onto
      // the line item ad object.
      $scope.setCurrentStep(2);
      $scope.lineItemAd.creative_id = creative.id;
      $scope.lineItemAd.name = $scope.htmlAd.name;
    });
  };

  $scope.uploadFromLibrary = function () {
    console.log('uploading ad from library...');
    $scope.setCurrentStep(2);
  };

  $scope.saveLineItemAd = function (hideModal) {
    LineItemAdAPI.post({
      lineItemAd: $scope.lineItemAd,
      lineItemId: +$stateParams.lineitemId
    })

    .then(function (lineItem) {
      $scope.lineItemAds.push(_(lineItem.ads).last());
      hideModal();
      $scope.clearAdFields();
      $timeout(function () {
        $alert(StaticData.growl({
          type: 'success',
          title: 'Success',
          message: 'Ad uploaded.'
        }));
      }, 200);
    });
  };

  $scope.updateLineItemAd = function (hideModal, lineItemAd) {
    if (!lineItemAd.impression_tracking_pixels) {
      lineItemAd.impression_tracking_pixels = [];
    }

    $scope.lineItemAd = {
      id: lineItemAd.id ,
      name: lineItemAd.name,
      click_url: lineItemAd.click_url,
      click_tracking_url: lineItemAd.click_tracking_url,
      impression_tracking_pixels: lineItemAd.impression_tracking_pixels,
      tracking_tag: lineItemAd.tracking_tag,
      rotation_type: lineItemAd.rotation_type,
      rotation_value: lineItemAd.rotation_value
    };

    LineItemAdAPI.put({
      lineItemAd: $scope.lineItemAd,
      lineItemId: +$stateParams.lineitemId
    })

    .then(function () {
      hideModal();
      $scope.clearAdFields();
      $timeout(function () {
        $alert(StaticData.growl({
          type: 'success',
          title: 'Success',
          message: 'Ad updated.'
        }));
      }, 200);
    });
  };

  $scope.clearAdFields = function () {
    $scope.showBar     = false;
    $scope.imageAd     = _.extend({}, StaticData.imageAd);
    $scope.htmlAd      = _.extend({}, StaticData.htmlAd);
    $scope.lineItemAd  = {
      name: '',
      creative_id: null,
      click_url: '',
      click_tracking_url: '',
      impression_tracking_pixels: [],
      tracking_tag: '',
      rotation_type: 'random',
      rotation_value: 1
    };
  };

  $scope.removeITP = function (itp, lineItemAd) {
    var index = $scope.lineItemAd.impression_tracking_pixels.indexOf(itp);
    $scope.lineItemAd.impression_tracking_pixels.splice(index, 1);
    $alert(StaticData.growl({
      type: 'info',
      title: 'Notice',
      message: 'Impression Tracking Pixel URL removed.'
    }));
  };

  // LineItemAd actions:
  $scope.preview = function (lineItemAd) {
    $scope.setCurrentStep(4);
    $scope.asset_url = lineItemAd.asset_url;
  };

  $scope.edit = function (lia) {
    $scope.setCurrentStep(5);
    $scope.lineItemAd = lia;

    if (!lia.click_url.length && !lia.click_tracking_url.length) {
      $scope.urlType = 'click_url';
    } else if (lia.click_url.length) {
      $scope.urlType = 'click_url';
    } else if (lia.click_tracking_url.length) {
      $scope.urlType = 'click_tracking_url';
    }
  };

  $scope.keep = function () {
    console.log('keeping item.');
  };

  $scope.remove = function (lineItemAd) {
    console.log(lineItemAd);
    // lineitemInstance.ads_attributes = [{
    //   id: lineItemAd.id, _destroy: 1
    // }];
    // LineItemAPI.put(lineitemInstance).then(function () {
    //   var index = $scope.lineItemAds.indexOf(lineItemAd);
    //   $scope.lineItemAds.splice(index, 1);
    //   $alert(StaticData.growl({
    //     type: 'success',
    //     title: 'Success',
    //     message: 'Ad deleted.'
    //   }));
    // });
  };

  $scope.mobileInsights = {
    'age': {
      name: 'Age',
      control: 0.19,
      data: [
        {stratum: '18-24', imps: 2342, ctr: 0.18},
        {stratum: '25-34', imps: 1342, ctr: 0.29},
        {stratum: '35-44', imps: 942,  ctr: 0.23},
        {stratum: '55-65', imps: 2742, ctr: 0.43},
        {stratum: '> 65',  imps: 1765, ctr: 0.47}
      ]
    },
    'income': {
      name: 'Income',
      control: 0.14,
      data: [
        {stratum: '< $30k',    imps: 2342, ctr: 0.19},
        {stratum: '$30-49k',   imps: 1342, ctr: 0.04},
        {stratum: '$50-74k',   imps: 942,  ctr: 0.23},
        {stratum: '$75-99k',   imps: 2742, ctr: 0.43},
        {stratum: '$100-125k', imps: 7823, ctr: 0.45},
        {stratum: '> $125k',   imps: 9082, ctr: 0.25}
      ]
    },
    'os': {
      name: 'Operating System',
      control: 0.25,
      data: [
        {stratum: 'iOS',     imps: 23442, ctr: 0.37},
        {stratum: 'Android', imps: 39867, ctr: 0.63}
      ]
    }
  };

});
