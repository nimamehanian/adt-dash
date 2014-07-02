app.factory('StaticData', function ($filter, Dma) {
  return {
    imageAd: {
      ad_type: 'image',
      advertiser_id: null
    },
    htmlAd: {
      name: null,
      format: null,
      ad_tag: null,
      ad_type: 'html',
      mraid: false,
      width: null,
      height: null,
      advertiser_id: null,
      id: null
    },
    lineItemAd: {
      name: '',
      creative_id: null,
      click_url: '',
      click_tracking_url: '',
      impression_tracking_pixels: [],
      tracking_tag: '',
      rotation_type: 'random',
      rotation_value: 1
    },

    wizardSteps: [
      'uploadImages',
      'uploadHTML',
      'lineItemAdForm',
      'library',
      'previewAd',
      'editAd'
    ],

    growl: function (params) {
      return {
        show: true,
        duration: 3,
        container: 'body',
        placement: 'top-right',
        animation: 'slide-right',
        template: 'alertTemplate.tpl.html',
        type: params.type,
        title: params.title,
        content: params.message
      };
    },

    pacingTypes: [
      {name: '<i class="icon-resize-horizontal"></i>&nbsp;&nbsp; Remaining Even', value: 'remaining_even'},
      {name: '<i class="icon-exchange"></i>&nbsp;&nbsp; Overall Even', value: 'overall_even'},
      {name: '<i class="icon-fast-forward"></i>&nbsp;&nbsp; ASAP', value: 'asap'}
    ],

    htmlAdModal:  {title: 'Upload HTML'},
    imageAdModal: {title: 'Upload Images'},
    previewAd:    {title: 'Preview Ad'},
    editAd:       {title: 'Edit Ad'},
    libraryModal: {title: 'Library'},

    setAdFormat: function (params) {
      switch (params.width + 'x' + params.height) {
        case '300x50'  : return 'small_banner';
        case '320x50'  : return 'banner';
        case '300x250' : return 'mrect';
        case '320x480' : return 'phone_full';
        case '728x90'  : return 'leaderboard';
        case '160x600' : return 'skyscraper';
        case '1024x768': return 'tablet_full';
        case '468x60'  : return 'tablet_banner';
        case '1024x90' : return 'tablet_landscape';
        default        : return 'custom';
      }
    },

    getTitle: function (currentStep) {
      switch (currentStep) {
        case 0: return 'Upload Images';
        case 1: return 'Upload HTML';
        case 2: return 'Line Item Ad Details';
        case 3: return 'Library';
        case 4: return 'Preview Ad';
        case 5: return 'Edit Ad';
      }
    },

    campaignDetailsTemplate: function (campaign) {
      //Filters
      var date          = $filter('date');
      var pacing        = $filter('pacing');
      var currency      = $filter('currency');
      var centsless     = $filter('centsless');
      var commaSeparate = $filter('commaSeparate');
      var limitTo       = $filter('limitTo');
      var ellipsis      = $filter('ellipsis');

      var name         = '<span class="bold pull-left">Name:</span><span class="pull-right">' + ellipsis(limitTo(campaign.name, 25)) + '</span><br />';
      var begins       = '<span class="bold pull-left">Begins:</span><span class="pull-right">' + date(campaign.start_date, 'EEE, dd MMM yyyy') + '</span><br />';
      var ends         = '<span class="bold pull-left">Ends:</span><span class="pull-right">' + date(campaign.end_date, 'EEE, dd MMM yyyy') + '</span><br />';
      var advertiser   = '<span class="bold pull-left">Advertiser:</span><span class="pull-right">' + campaign.advertiser.name + '</span><br />';
      var dollarBudget = '<span class="bold pull-left">Dollar Budget:</span><span class="pull-right">' + centsless(currency(campaign.dollar_budget)) + '</span><br />';
      var impBudget    = '<span class="bold pull-left">Impression Budget:</span><span class="pull-right">' + commaSeparate(campaign.imp_budget) + '</span><br />';
      var pacingType   = '<span class="bold pull-left">Pacing Type:</span><span class="pull-right">' + pacing(campaign.pacing_type) + '</span><br />';


      return name + begins + ends + advertiser + dollarBudget + impBudget + pacingType;
    },

    lineItemDetailsTemplate: function (lineItem) {
      var finalString = '';

      //Filters
      var date       = $filter('date');
      var currency   = $filter('currency');
      var centsless  = $filter('centsless');
      var capitalize = $filter('capitalize');
      var formatOS   = $filter('os');
      var toAmPm     = $filter('toAmPm');
      var limitTo    = $filter('limitTo');
      var ellipsis   = $filter('ellipsis');

      // DMA
      var dmas = ['<ul>'];
      if (lineItem.target_geo_dmas && lineItem.target_geo_dmas.length) {
        _(lineItem.target_geo_dmas).each(function (dma) {
          var dmaDesc = _(Dma.list).findWhere({code: +dma}).name;
          dmas.push('<li class="subtext">' + dmaDesc + '</li>');
        });
        dmas.push('</ul>');
        dmas = dmas.join('');
      } else {
        dmas.push('<li class="subtext">Unspecified</li></ul>');
        dmas = dmas.join('');
      }

      // TIME ZONE
      var timeZones = ['<ul>'];
      if (lineItem.target_geo_timezones && lineItem.target_geo_timezones.length) {
        _(lineItem.target_geo_timezones).each(function (zone) {
          timeZones.push('<li class="subtext">' + zone + '</li>');
        });
        timeZones.push('</ul>');
        timeZones = timeZones.join('');
      } else {
        timeZones.push('<li class="subtext">Unspecified</li></ul>');
        timeZones = timeZones.join('');
      }

      // OS
      var oses = ['<ul>'];
      if (lineItem.target_device_oses && lineItem.target_device_oses.length) {
        _(lineItem.target_device_oses).each(function (os) {
          oses.push('<li class="subtext">' + formatOS(os) + '</li>');
        });
        oses.push('</ul>');
        oses = oses.join('');
      } else {
        oses.push('<li class="subtext">Unspecified</li></ul>');
        oses = oses.join('');
      }

      // Required fields
      var name       = '<span class="bold pull-left">Name:</span><span class="pull-right">' + ellipsis(limitTo(lineItem.name, 25)) + '</span><br />';
      var begins     = '<span class="bold pull-left">Begins:</span><span class="pull-right">' + date(lineItem.start_date, 'EEE, dd MMM yyyy') + '</span><br />';
      var ends       = '<span class="bold pull-left">Ends:</span><span class="pull-right">' + date(lineItem.end_date, 'EEE, dd MMM yyyy') + '</span><br />';
      var maxCPM     = '<span class="bold pull-left">Max CPM Bid:</span><span class="pull-right">' + centsless(currency(lineItem.max_cpm)) + '</span><br />';
      var capAmount  = '<span class="bold pull-left">Cap Amount:</span><span class="pull-right">' + lineItem.freq_cap_amount + '</span><br />';
      var capType    = '<span class="bold pull-left">Cap Type:</span><span class="pull-right">' + capitalize(lineItem.freq_cap_type) + '</span><br />';
      var tvStrategy = '<span class="bold pull-left">TV Strategy:</span><span class="pull-right">' + (lineItem.tv_strategy ? capitalize(lineItem.tv_strategy) : 'Unspecified') + '</span><br />';

      // Optional fields
      var appNames   = '<span class="bold pull-left">App Names:</span><span class="pull-right">' + 'Unspecified' + '</span><br />';
      var dmaRegion  = '<span class="bold pull-left">DMAs:</span><br /><span>' + (lineItem.target_geo_dmas ? dmas : '') + '</span>';
      var timeZoneRegion = '<span class="bold pull-left">Time Zones:</span><br /><span>' + (lineItem.target_geo_timezones ? timeZones : '') + '</span>';
      var osRegion       = '<span class="bold pull-left">Operating Systems:</span><br /><span>' + (lineItem.target_device_oses ? oses : '') + '</span>';

      var daysOfWeek = lineItem.target_dayparts.daysofweek;
      var daypartsRegion = '<span class="bold pull-left">Dayparts:</span><br />' +
        '<span class="bold subtext">Time Zone: ' + lineItem.target_dayparts.timezone + '</span><br />';

        if (lineItem.target_dayparts.daysofweek.sunday) {
          daypartsRegion += '<span class="bold subtext">Sunday: ' + toAmPm(lineItem.target_dayparts.daysofweek.sunday) + '</span><br />';
        }

        if (lineItem.target_dayparts.daysofweek.monday) {
          daypartsRegion += '<span class="bold subtext">Monday: ' + toAmPm(lineItem.target_dayparts.daysofweek.monday) + '</span><br />';
        }

        if (lineItem.target_dayparts.daysofweek.tuesday) {
          daypartsRegion += '<span class="bold subtext">Tuesday: ' + toAmPm(lineItem.target_dayparts.daysofweek.tuesday) + '</span><br />';
        }

        if (lineItem.target_dayparts.daysofweek.wednesday) {
          daypartsRegion += '<span class="bold subtext">Wednesday: ' + toAmPm(lineItem.target_dayparts.daysofweek.wednesday) + '</span><br />';
        }

        if (lineItem.target_dayparts.daysofweek.thursday) {
          daypartsRegion += '<span class="bold subtext">Thursday: ' + toAmPm(lineItem.target_dayparts.daysofweek.thursday) + '</span><br />';
        }

        if (lineItem.target_dayparts.daysofweek.friday) {
          daypartsRegion += '<span class="bold subtext">Friday: ' + toAmPm(lineItem.target_dayparts.daysofweek.friday) + '</span><br />';
        }

        if (lineItem.target_dayparts.daysofweek.saturday) {
          daypartsRegion += '<span class="bold subtext">Saturday: ' + toAmPm(lineItem.target_dayparts.daysofweek.saturday) + '</span><br />';
        }

      finalString += name + begins + ends + maxCPM + capAmount + capType + tvStrategy;

      if (lineItem.target_app_names.length)                  { finalString += appNames; }
      if (lineItem.target_geo_dmas.length)                   { finalString += dmaRegion; }
      if (lineItem.target_geo_timezones.length)              { finalString += timeZoneRegion; }
      if (lineItem.target_device_oses.length)                { finalString += osRegion; }

      _(daysOfWeek).each(function (data, day) {
        console.log(day);
        if (!_(lineItem.target_dayparts.daysofweek[day]).isEmpty()) { finalString += daypartsRegion; }
      });

      return finalString;
    }
  };
});
