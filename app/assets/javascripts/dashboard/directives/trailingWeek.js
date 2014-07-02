app.directive('trailingWeek', function ($window, $filter) {
  return {
    restrict: 'A',
    scope: {
      ngModel: '='
    },
    link: function (scope, element, attrs) {
      window.onresize = function () {
        scope.$apply();
      };

      scope.$watch(function () {
        return angular.element($window)[0].innerWidth;
      }, function () {
        scope.render(scope.ngModel);
      });

      var parseDate = d3.time.format('%Y-%m-%d').parse;
      var svg = d3.select(element[0])
        .append('svg')
        .attr('class', 'sparkline-chart');

      scope.render = function (data) {
        svg.selectAll('*').remove();
        if (!data || !data.length) {
          console.log('No CTR data for trailing week available.');
          return false;
        }

        var beginDate = new Date(data[0].date);
        var endDate = new Date(data[data.length - 1].date);
        var dayAfterEnd = endDate.setDate(endDate.getDate() + 1);
        var beginRange = 0;
        var endRange = 158;

        // DEFINE SCALES
        var timeScale = d3.time.scale()
          .domain([beginDate, dayAfterEnd])
          .range([beginRange, endRange]);

        var ctrScale = d3.scale.linear()
          .domain([0, d3.max(data, function (d) { return d.ctr; })])
          .range([28, 1]);

        // DEFINE SPARKLINE
        var sparkline = d3.svg.line()
          .interpolate('monotone')
          .x(function (d) { return timeScale(parseDate(d.date)); })
          .y(function (d) { return ctrScale(d.ctr); });

        // RENDER
        svg.append('path')
          .attr('class', 'sparkline')
          .attr('d', sparkline(data));
      };
    }
  };
});
