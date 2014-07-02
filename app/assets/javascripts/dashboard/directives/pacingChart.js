app.directive('pacing', function ($window, $filter, $timeout) {
  var date          = $filter('date');
  var truncInt      = $filter('truncInt');
  var daySuffix     = $filter('daySuffix');
  var commaSeparate = $filter('commaSeparate');

  return {
    restrict: 'A',
    scope: {
      reporting: '=',
      lineItem: '='
    },
    link: function (scope, element, attrs) {
      window.onresize = function () {
        scope.$apply();
      };

      scope.$watch(function () {
        return angular.element($window)[0].innerWidth;
      }, function () {
        scope.render(scope.reporting);
      });

      var sunBurst  = '#fabb3d';
      var seaGreen  = '#78cd51';

      var carotene = '#faa928';
      var royal    = '#0e7ac4';
      var sky      = '#3ea9f5';
      var emerald  = '#56be8e';
      var rose     = '#f27398';
      var burnt    = '#363945';

      var parseDate = d3.time.format('%Y-%m-%d').parse;

      var svg = d3.select(element[0])
        .append('svg')
        .attr('class', 'chart');

      scope.render = function (data) {
        svg.selectAll('*').remove();
        if (!data || !data.length) {
          console.log('No pacing data available.');
          return false;
        }

        var pacingLineData = [];
        _(data).each(function (day) {
          pacingLineData.push(_.clone(day));
        });

        var beginDate = new Date(scope.lineItem.start_date);
        var endDate = new Date(scope.lineItem.end_date);
        var dayAfterEnd  = endDate.setDate(endDate.getDate() + 1);
        var beginRange = 35;
        var endRange = element[0].scrollWidth - 5;
        var dateDiscrepancy = scope.lineItem.total_days - data.length;

        if (dateDiscrepancy) {
          var dayToPickUpFrom = data.length;
          var dateToPickUpFrom = data[data.length - 1].date;
          _(dateDiscrepancy).times(function (index) {
            var nextDate = moment(dateToPickUpFrom).add('days', 1).format('YYYY-MM-DD');
            dateToPickUpFrom = nextDate;
            pacingLineData.push({
              day: dayToPickUpFrom += 1,
              date: nextDate,
              imps: 0,
              clicks: 0,
              ctr: 0,
              impsServedThusFar: 0
            });
          });
        }

        // DEFINE SCALES
        var timeScale = d3.time.scale()
          .domain([beginDate, dayAfterEnd])
          .range([beginRange, endRange]);

        var impScale = d3.scale.linear()
          .domain([0, d3.max(data, function (d) {
            return scope.lineItem.impression_budget;
          })])
          .range([235, 0]);


        // DEFINE AXES
        var timeAxis = d3.svg.axis()
          .scale(timeScale)
          .orient('bottom')
          .ticks(d3.time.days, 4)
          .tickSize(4)
          .outerTickSize(0)
          .tickFormat(d3.time.format('%-m/%-e'))
          .tickPadding(2);

        var impAxis = d3.svg.axis()
          .scale(impScale)
          .orient('left')
          .ticks(5)
          .tickSize(0)
          .tickPadding(3)
          .tickFormat(function (d) {
            return truncInt(d);
          });

        var impBudget = scope.lineItem.impression_budget;
        var daysInCampaign = scope.lineItem.total_days;
        var projectedImps = Math.ceil(impBudget / daysInCampaign);

        // DEFINE PACING LINE
        var pacingLine = d3.svg.line()
          .interpolate('linear')
          .x(function (d, i) { return timeScale(parseDate(d.date)); })
          .y(function (d, i) { return impScale(Math.ceil(projectedImps * (d.day))); });

        // DEFINE 'IMPS SERVED' LINE
          var impLine = d3.svg.line()
          .interpolate('linear')
          .x(function (d, i) { return timeScale(parseDate(d.date));  })
          .y(function (d, i) { return impScale(d.impsServedThusFar); });

        // DEFINE POPOVER
        var popover = d3.select('body').append('div').attr('class', 'chart-popover');

        // RENDER
        svg.append('g')
          .attr('class', 'time-axis')
          .attr('transform', 'translate(0, 245)')
          .call(timeAxis);

        svg.append('g')
          .attr('class', 'ctr-axis')
          .attr('transform', 'translate(35, ' + (10) + ')')
          .call(impAxis);

        svg.append('path')
          .attr('class', 'pacing-line')
          .attr('transform', 'translate(' + (-5) + ', ' + (13) + ')')
          .transition()
            .attr('d', pacingLine(pacingLineData));

        svg.append('path')
          .attr('class', 'imp-line')
          .attr('transform', 'translate(' + (5) + ', ' + (10) + ')')
          .transition()
            .attr('d', impLine(data));

        svg.selectAll('.pacing-dot')
          .data(data).enter().append('circle')
          .attr('class', 'pacing-dot')
          .attr('r', 0)
          .attr('cx', function (d, i) { return timeScale(parseDate(d.date)); })
          .attr('cy', function (d, i) { return impScale(d.impsServedThusFar); })
          .attr('transform', 'translate(' + (5) + ', ' + (10) + ')')
            .transition().duration(550)
              .attr('r', 8)
              .style('fill', royal)
            .transition().duration(750)
              .attr('r', 4)
              .style('fill', emerald);

        // POPOVER FUNCTIONALITY
        d3.selectAll('.pacing-dot')
          .datum(data)
          .on('mouseover', function (d, i) {
            // Dilate node
            d3.select(this).transition().duration(300)
              .attr('r', function (d) { return 8; })
              .style('fill', royal);

            // Render popover to left of cursor, if its
            // dimensions overflow the right edge of viewport
            var xOffset = 0;
            (d3.event.pageX + 200) >= $window.innerWidth ? xOffset = -200 : xOffset = 10;

            // Format date display in node popover
            var formattedDate = '';
            var month = date(d[i].date, 'MMMM');
            var day = daySuffix(date(d[i].date, 'dd'));
            var year = date(d[i].date, 'yyyy');
            formattedDate = month + ' ' + day + ', ' + year;

            // Compile node popover contents ('cpt' -> Chart Popover Template)
            var cpt = '<div class="chart-popover-title text-center">Figures for ' + formattedDate + '</div>';
            cpt += '<div class="chart-popover-contents"><span class="bold">Target:  </span>' + commaSeparate(projectedImps * d[i].day) + ' <small>imps</small><br />';
            cpt += '<span class="bold">Served: </span>' + commaSeparate(d[i].impsServedThusFar) + ' <small>imps</small>';

            popover.style('opacity', 0.8)
                   .style('z-index', '1')
                   .style('left', (d3.event.pageX + xOffset) + 'px')
                   .style('top' , (d3.event.pageY - 40) + 'px')
                   .html(cpt);

          })
          .on('mouseout', function (d, i) {
            // Contract node
            d3.select(this).transition().duration(500)
              .attr('r', function (d) { return 4; })
              .style('fill', emerald);

            $timeout(function () { hidePopover(); }, 0);

            var pageY = d3.event.pageY;
            var hidePopover = function (e) {
              // This is the popover hiding animation sequence:
              // "Stretch back"
              var t1 = d3.transition().duration(200).each(function () {
                popover.style('top', (pageY - 90) + 'px');
              });

              // "Let go"
              var t2 = t1.transition().duration(50).each(function () {
                popover.transition().style('top', '500px');
              });

              // Hide
              var t3 = t2.transition().duration(150).each(function () {
                popover.transition()
                  .style('opacity', 0)
                  .style('z-index', '-2');
              });
            };// hidePopover function
          });// .on('mouseout'... AND d3.selectAll('.pacing-dot')

      };// scope.render
    }// link function
  };// return
});// app.directive
