lineitem.controller('LineItems.New-Edit',
function ($scope, $stateParams, $filter, $location,
$alert, StaticData, campaign, lineitemInstance,
LineItemAttributes, LineItemForm, LineItemAPI, Dma) {

  var dateFilter      = $filter('date');
  $scope.today        = new Date();

  $scope.sunday       = LineItemForm.sunday;
  $scope.monday       = LineItemForm.monday;
  $scope.tuesday      = LineItemForm.tuesday;
  $scope.wednesday    = LineItemForm.wednesday;
  $scope.thursday     = LineItemForm.thursday;
  $scope.friday       = LineItemForm.friday;
  $scope.saturday     = LineItemForm.saturday;

  $scope.freqCapType  = LineItemForm.freqCapType;
  $scope.freqCapTypes = LineItemForm.freqCapTypes;

  $scope.tvStrategy   = LineItemForm.tvStrategy;
  $scope.tvStrategies = LineItemForm.tvStrategies;

  $scope.chosenAsset  = '';

  $scope.dma          = LineItemForm.dma;
  $scope.dmas         = LineItemForm.dmas;
  $scope.dmaDesc      = [];

  $scope.zone         = LineItemForm.zone;
  $scope.timezones    = LineItemForm.timezones;

  $scope.dpZone       = LineItemForm.dpZone;
  $scope.dpZones      = LineItemForm.dpZones;

  $scope.os           = LineItemForm.os;
  $scope.oses         = LineItemForm.oses;

  $scope.day          = LineItemForm.day;
  $scope.week         = LineItemForm.week;


  $scope.campaignAssets = [
    {
      selected: false,
      type: 'audio',
      filename: 'someAudio.mp3',
      brand: 'Cool Brand Inc.'
    },
    {
      selected: false,
      type: 'schedule',
      filename: 'twc tv schedule',
      brand: 'TWC Inc.'
    },
    {
      selected: false,
      type: 'audio',
      filename: 'yetAnotherAudio.mp3',
      brand: 'Bose'
    },
    {
      selected: false,
      type: 'schedule',
      filename: 'schedule for cool brand',
      brand: 'Cool Brand Inc.'
    },
    {
      selected: false,
      type: 'audio',
      filename: 'anotherAudio.mp3',
      brand: 'TWC Inc.'
    },
    {
      selected: false,
      type: 'schedule',
      filename: 'yet another schedule',
      brand: 'Bose'
    },
    {
      selected: false,
      type: 'audio',
      filename: 'yahoo.mp3',
      brand: 'Fiat'
    }
  ];

  $scope.addAsset = function (asset, index) {
    if (asset.type === 'schedule') {
      _($scope.campaignAssets).each(function (a) {
        if (a.selected) { a.selected = false; }
      });
      $scope.lineitem.tv_strategy_assets = [];
      $scope.lineitem.tv_strategy_assets.push(asset);
      $scope.campaignAssets[index].selected = true;
    }
    if (asset.type === 'schedule' ||
        asset.type === 'audio' &&
        $scope.lineitem.tv_strategy_assets[0] &&
        $scope.lineitem.tv_strategy_assets[0].type === 'schedule') {

      _($scope.campaignAssets).each(function (a) {
        if (a.type === 'schedule' && a.selected) {
          a.selected = false;
        }
      });
      $scope.lineitem.tv_strategy_assets = [];
      $scope.lineitem.tv_strategy_assets.push(asset);
      $scope.campaignAssets[index].selected = true;
    } else {
      $scope.lineitem.tv_strategy_assets.push(asset);
      $scope.campaignAssets[index].selected = true;
    }
  };

  $scope.removeAsset = function (asset, index) {
    $scope.lineitem.tv_strategy_assets.splice(index, 1);
    _($scope.campaignAssets).findWhere({
      filename: asset.filename,
      brand: asset.brand,
      type: asset.type
    }).selected = false;
  };

  $scope.clear = function () {
    var week = [
      $scope.sunday, $scope.monday, $scope.tuesday,
      $scope.wednesday, $scope.thursday, $scope.friday,
      $scope.saturday
    ];
    _(week).each(function (day) {
      _(day).each(function (hour) {
        hour.selected = false;
      });
    });
    $scope.lineitem.target_dayparts = {
      timezone: 'Local',
      daysofweek: {
        sunday: [], monday: [], tuesday: [], wednesday: [],
        thursday: [], friday: [], saturday: []
      }
    };
  };

  $scope.resetDayparts = function () {
    var week = [
      $scope.sunday, $scope.monday, $scope.tuesday,
      $scope.wednesday, $scope.thursday, $scope.friday,
      $scope.saturday
    ];
    _(week).each(function (day) {
      _(day).each(function (hour) {
        hour.selected = false;
      });
    });
  };

  $scope.removeDMA = function (dma) {
    var code = dma.match(/\d{3}/)[0];
    var desc = _(Dma.list).findWhere({code: +code}).name;

    var modelIndex = $scope.lineitem.target_geo_dmas.indexOf(code);
    var descIndex  = $scope.dmaDesc.indexOf(desc);

    $scope.lineitem.target_geo_dmas.splice(modelIndex, 1);
    $scope.dmaDesc.splice(descIndex, 1);

    $alert(StaticData.growl({
      type: 'info',
      title: 'Notice',
      message: 'DMA removed.'
    }));
  };

  if (!$stateParams.lineitemId) {
    // NEW Line Item

    $scope.campaign = campaign;
    $scope.campaignId = +$stateParams.campaignId;
    $scope.lineitem = lineitemInstance;
    $scope.clear();

    $scope.lineitem.tv_strategy_assets = [];

  } else if ($stateParams.lineitemId) {
    // EDIT Line Item

    $scope.lineitemId = +$stateParams.lineitemId
    $scope.lineitem = LineItemAttributes.load(lineitemInstance);

    // Highlight Dayparts
    $scope.resetDayparts();
    _($scope.lineitem.target_dayparts.daysofweek).each(function (times, day) {
      _(times).each(function (time) {
        _($scope[day]).findWhere({time: time}).selected = true;
      });
    });

    // Load DMA names into dropdown
    _($scope.lineitem.target_geo_dmas).each(function (code) {
      $scope.dmaDesc.push(_(Dma.list).findWhere({code: +code}).name);
    });
  }

  $scope.$watch(function () {
    return $scope.lineitem.tv_strategy;
  }, function () {
    if ($scope.lineitem.tv_strategy === 'conquest') {
      $scope.chosenAsset = 'audio';
    } else {
      $scope.chosenAsset = '';
    }
  });

  $scope.isSelected = function (block) {
    return block.selected ? true : false;
  };

  $scope.toggleSelect = function (block) {
    block.selected = !block.selected;
    if (block.selected) {
      $scope.lineitem.target_dayparts.daysofweek[block.day].push(block.time);
    } else {
      $scope.lineitem.target_dayparts.daysofweek[block.day] = _($scope.lineitem.target_dayparts.daysofweek[block.day]).reject(function (time) {
        return time === block.time;
      });
    }
  };

  $scope.submit = function (li) {
    var httpMethod = li.id ? 'put' : 'post';
    li.start_date = dateFilter(li.start_date, 'yyyy-MM-dd');
    li.end_date = dateFilter(li.end_date, 'yyyy-MM-dd');
    li.target_dayparts.daysofweek = LineItemAttributes.sortDayparts(li);

    LineItemAPI[httpMethod](li).then(function (li) {
      $location.path('/line-items/' + li.id);
    });
  };
});
