lineitem.factory('LineItemAttributes', function () {
  return {
    load: function (li) {
      var lineitem = {
        id: li.id,
        name: li.name,
        campaign: li.campaign,
        start_date: li.start_date,
        end_date: li.end_date,
        max_cpm: Number(li.max_cpm),
        freq_cap_amount: li.freq_cap_amount,
        freq_cap_type: li.freq_cap_type,
        target_app_names: li.target_app_names,
        target_geo_dmas: li.target_geo_dmas,
        target_geo_timezones: li.target_geo_timezones,
        target_device_oses: li.target_device_oses,
        target_dayparts: {
          timezone: li.target_dayparts.timezone,
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

      if (li.tv_strategy) {
        lineitem.tv_strategy = li.tv_strategy;
      } else {
        lineitem.tv_strategy = 'amplify';
      }

      if (li.target_dayparts.daysofweek.sunday) {
        lineitem.target_dayparts.daysofweek.sunday = li.target_dayparts.daysofweek.sunday;
      }
      if (li.target_dayparts.daysofweek.monday) {
        lineitem.target_dayparts.daysofweek.monday = li.target_dayparts.daysofweek.monday;
      }
      if (li.target_dayparts.daysofweek.tuesday) {
        lineitem.target_dayparts.daysofweek.tuesday = li.target_dayparts.daysofweek.tuesday;
      }
      if (li.target_dayparts.daysofweek.wednesday) {
        lineitem.target_dayparts.daysofweek.wednesday = li.target_dayparts.daysofweek.wednesday;
      }
      if (li.target_dayparts.daysofweek.thursday) {
        lineitem.target_dayparts.daysofweek.thursday = li.target_dayparts.daysofweek.thursday;
      }
      if (li.target_dayparts.daysofweek.friday) {
        lineitem.target_dayparts.daysofweek.friday = li.target_dayparts.daysofweek.friday;
      }
      if (li.target_dayparts.daysofweek.saturday) {
        lineitem.target_dayparts.daysofweek.saturday = li.target_dayparts.daysofweek.saturday;
      }
      return lineitem;
    },
    sortDayparts: function (lineItem) {
      var daysofweek = lineItem.target_dayparts.daysofweek;
      var day;

      _(daysofweek).each(function (hours, day) {
        day = hours.sort(function (a, b) { return a - b; });
      });

      return daysofweek;
    }
  }
});
