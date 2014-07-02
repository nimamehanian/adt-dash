app.directive('impctr', function ($window, $filter, $timeout) {
  var date           = $filter('date');
  var truncInt       = $filter('truncInt');
  var daySuffix      = $filter('daySuffix');
  var commaSeparate  = $filter('commaSeparate');

  return {
    restrict: 'A',
    scope: {
      reporting: '='
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

      // Increase values to push up
      var ctrLineOffset = 50;
      var ctrAxisOffset = 60;

      var svg = d3.select(element[0])
        .append('svg')
        .attr('class', 'chart');

      scope.render = function (data) {
        svg.selectAll('*').remove();
        if (!data.length) {
          console.log('No daily CTR data available.');
          return false;
        }

        // width for each impression volume bar
        var barWidth = Math.ceil((element[0].scrollWidth / data.length));
        if (barWidth % 2 !== 0) { barWidth -= 1; }
        if (barWidth > 10) { barWidth = 10; }

        var beginDate = new Date(data[0].date);
        var lastDate  = new Date(data[data.length - 1].date);
        var tomorrow  = lastDate.setDate(lastDate.getDate() + 1);

        // DEFINE SCALES
        var timeScale = d3.time.scale()
          // .domain() is exclusive of its end range, so to get all data
          // points rendered within x-axis, we must increment by one day
          .domain([beginDate, tomorrow])
          .range([35, element[0].scrollWidth - 5]);

        var ctrScale = d3.scale.linear()
          .domain([0, d3.max(data, function (d) {
            return d.ctr;
          })])
          .range([250, ctrAxisOffset]);

        var impScale = d3.scale.linear()
          .domain([0, d3.max(data, function (d) {
            return (d.imps + 50000);
          })])
          .range([0, 50]);


        // DEFINE AXES
        var timeAxis = d3.svg.axis()
          .scale(timeScale)
          .orient('bottom')
          .ticks(d3.time.days, 3)
          .tickSize(4)
          .outerTickSize(4)
          .tickFormat(d3.time.format('%-m/%-e'))
          // .tickFormat('')
          .tickPadding(1);

        var pseudoAxis = d3.svg.axis()
          .scale(timeScale)
          .orient('bottom')
          .ticks(d3.time.days, 1)
          .tickSize(0)
          .tickFormat('')
          .tickPadding(3);

        var ctrAxis = d3.svg.axis()
          .scale(ctrScale)
          .orient('left')
          .ticks(5)
          .tickSize(0)
          .tickPadding(3)
          .tickFormat(function (d) {
            if (String(d).length === 1) {
              return d + '.0%';
            } else {
              return d + '%';
            }
          });

        // DEFINE CTR LINE (The actual plot)
        var ctrLine = d3.svg.line()
          .interpolate('linear')
          .x(function (d) { return timeScale(parseDate(d.date)); })
          .y(function (d) { return ctrScale(d.ctr); });

        // DEFINE POPOVER
        var popover = d3.select('body').append('div').attr('class', 'chart-popover');

        // RENDER
        svg.append('g')
          .attr('class', 'time-axis')
          .attr('transform', 'translate(0, 245)')
          .call(timeAxis)
          .append('text')
            .style('text-rendering', 'optimizeLegibility')
            .attr('transform', 'translate(3, -18), rotate(0)')
            .text('Imps');

        svg.append('g')
          .attr('class', 'pseudo-axis')
          .attr('transform', 'translate(0, 200)')
          .call(pseudoAxis);

        svg.append('g')
          .attr('class', 'ctr-axis')
          .attr('transform', 'translate(35, ' + (-ctrAxisOffset + 10) + ')')
          .call(ctrAxis);

        // Render CTR line
        svg.append('path')
          .attr('class', 'ctr-line')
          .attr('transform', 'translate(' + (0) + ', ' + (-ctrLineOffset) + ')')
          .transition()
            .attr('d', ctrLine(data));

        // Render data nodes
        svg.selectAll('.ctr-dot')
          .data(data).enter().append('circle')
          .attr('class', 'ctr-dot')
          .attr('r', 0)
          .attr('cx', function (d) { return timeScale(parseDate(d.date)); })
          .attr('cy', function (d) { return ctrScale(d.ctr); })
          .attr('transform', 'translate(' + (0) + ', ' + (-ctrLineOffset) + ')')
            .transition().duration(550)
              .attr('r', 8)
              .style('fill', royal)
            .transition().duration(750)
              .attr('r', 4)
              .style('fill', rose);

        // Render impression volume (bar charts)
        svg.selectAll('rect')
          .data(data).enter()
            .append('rect')
              .attr('class', 'imp-bar')
              .attr('width', barWidth)
              .attr('height', function (d, i) { return impScale(0); })
              .attr('x', function (d, i) {
                return timeScale(parseDate(d.date));
              })
              .attr('y', function (d, i) {
                return 245 - impScale(0);
              })
              .attr('transform', 'translate(-' + (barWidth/2) + ', 0)')
              .transition().duration(650).delay(500)
                .attr('y', function (d) { return 245 - impScale(d.imps); })
                .attr('height', function (d) { return impScale(d.imps); });

        // POPOVER FUNCTIONALITY
        d3.selectAll('.ctr-dot')
          .datum(data)
          .on('mouseover', function (d, i) {
            // Dilate node
            d3.select(this).transition().duration(300)
              .attr('r', function (d) { return 8; })
              .style('fill', royal);

            // Have popover appear to left of cursor if its
            // dimensions overflow right edge of viewport
            var xOffset = 0;
            (d3.event.pageX + 200) >= $window.innerWidth ? xOffset = -200 : xOffset = 10;

            // Format date display in node popover
            var formattedDate = '';
            var month = date(d[i].date, 'MMMM');
            var day = daySuffix(date(d[i].date, 'dd'));
            var year = date(d[i].date, 'yyyy');
            formattedDate = month + ' ' + day + ', ' + year;

            // Compile node popover contents ('cpt' -> Chart Popover Template)
            var lowImps = d[i].imps < 20000;
            var cpt = '<div class="chart-popover-title text-center">Figures for ' + formattedDate + '</div>';
            lowImps ? cpt += '<div class="chart-popover-warning text-center">Impression volume below 20k</div>' : cpt += '';
            cpt += '<div class="chart-popover-contents"><span class="bold">CTR:  </span>' + d[i].ctr + '% <br />';
            cpt += '<span class="bold">Impressions: </span>' + commaSeparate(d[i].imps);

            lowImps ? popover.style('height', '9.5rem') : popover.style('height', '8rem');
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
              .style('fill', rose);

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
          });// .on('mouseout'... AND d3.selectAll('.ctr-dot')

      };// scope.render
    }// link function
  };// return
});// app.directive
