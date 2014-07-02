app.directive('mobileInsights', function ($window, $filter, $timeout) {
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

      var sunBurst = '#fabb3d';
      var seaGreen = '#78cd51';

      var svg = d3.select(element[0])
        .append('svg:svg').attr('class', 'insights-chart');

      scope.render = function (segment) {
        svg.selectAll('*').remove();
        if (!segment) {
          console.log('No insights data available.');
          return false;
        }

        var strataOffsetX = 65;
        var strataOffsetY = 20;
        var ctrOffset = 162;

        var impScale = d3.scale.linear()
          .domain([0, d3.max(segment.data, function (d) {
            return d.imps;
          })])
          .range([0, 90]);

        var ctrScale = d3.scale.linear()
          .domain([0, d3.max(segment.data, function (d) {
            return d.ctr;
          })])
          .range([0, 90]);

        // Impressions
        $timeout(function () {
          var impGroup = svg.append('svg:g').attr('class', 'imp-group')
            .attr('transform', 'translate(' + (strataOffsetX) + ',' + (strataOffsetY) + ')');

          impGroup.selectAll('rect')
            .data(segment.data).enter()
              .append('rect')
                .attr('class', 'imp-bar')
                .attr('transform', function (d, i) {
                  return 'translate(0,' + (i * 12) + ')';
                })
                .attr('width', 0)
                .attr('height', 10)
                .transition().duration(400)
                  .attr('width', function (d) {
                    return impScale(d.imps);
                  });

          impGroup.selectAll('text')
            .data(segment.data).enter()
              .append('text')
                .attr('class', 'strata')
                .attr('transform', function (d, i) {
                  return 'translate(' + (-60) + ', ' + ((i * 12) + 8) + ')';
                })
                .text(function (d, i) {
                  return d.stratum;
                });
        }, 500);

        // CTR
        $timeout(function () {
          var ctrGroup = svg.append('svg:g').attr('class', 'ctr-group')
            .attr('transform', 'translate(' + (ctrOffset) + ',' + (strataOffsetY) + ')');

          // OVER "Control CTR"
          ctrGroup.selectAll('rect')
            .data(segment.data).enter()
            .append('rect')
              .attr('transform', function (d, i) {
                return 'translate(' + (0) + ', ' + (i * 12) + ')';
              })
              .attr('width', 0)
              .attr('height', 10)
              .attr('class', 'ctr-over-control')
              .transition().duration(400)
                .attr('width', function (d, i) {
                  return ctrScale(d.ctr);
                });

          // UNDER "Control CTR"
          ctrGroup.selectAll('g.ctr-group')
          .data(segment.data).enter()
            .append('rect')
              .attr('transform', function (d, i) {
                return 'translate(' + (0) + ', ' + (i * 12) + ')';
              })
              .attr('width', 0)
              .attr('height', 10)
              .attr('class', 'ctr-under-control')
              .transition().duration(400)
                .attr('width', function (d, i) {
                  return d.ctr < segment.control ? ctrScale(d.ctr) : ctrScale(segment.control);
                });

          // Control Line
          svg.append('g.ctr-group:line')
            .attr('class', 'control-line')
            .attr('transform', 'translate(' + (ctrOffset) + ', ' + (strataOffsetY) + ')')
            .attr('x1', ctrScale(segment.control))
            .attr('y1', 0)
            .attr('x2', ctrScale(segment.control))
            .attr('y2', function () {
              return (segment.data.length * 12) - 2;
            })
        }, 500);

        // Title
        svg.append('text')
          .attr('class', 'strata-title')
          .attr('transform', 'translate(' + (5) + ', 10)')
          .text(segment.name);

        // svg.data(data.strata)
        //   .append('text')
        //     .attr('class', 'strata')
        //     .attr('transform', 'translate(' + (0) + ', 28)')
        //     .text(function (stratum, i) {
        //       console.log(stratum);
        //       return stratum;
        //     });

      };// scope.render
    }// link function
  };// return
});// app.directive
