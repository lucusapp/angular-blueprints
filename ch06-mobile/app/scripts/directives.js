'use strict';

angular.module('app.directives', [])

  .directive('barChart', ['$document', '$window', function ($document, $window) {

    return {

      scope: {
        data: '='
      },

      link: function (scope, element, attrs) {

        var chart = d3.select('#chart').append('svg').style('width', '95%');

        /**
         * you can define methods in link function?
         * @param data
         */
        scope.drawGraph = function (data) {


          chart.selectAll('*').remove();

          var barHeight = 20,
            barGap = 5,
            graphOrigin = 150,
            chartWidth = chart.style('width'),
            chartHeight = scope.data.length * (barHeight + barGap),
            color = d3.scale.category10(),
            xScale = d3.scale.linear()
              .domain([0, d3.max(data, function (d) {
                return d.amount;
              })])
              .range([0, chartWidth]);

          chart.attr('height', chartHeight);

          chart.selectAll('myBars')
            .data(data)
            .enter()
            .append('rect')
            .attr('height', barHeight)
            .attr('x', graphOrigin)
            .attr('y', function(d, i) {
              return i * (barHeight + barGap);
            })
            .attr('fill', function(d) {
              return color(d.amount);
            })
            .attr('width', function(d) {
              return xScale(d.amount);
            });

          chart.selectAll('categoryLabel')
            .data(data)
            .enter()
            .append('text')
            .attr('fill', '#fff')
            .attr('y', function(d, i) {
              return i * (barHeight + barGap) + 10;
            })
            .attr('x', (graphOrigin - 5))
            .attr('text-anchor', 'end')
            .text(function(d) {
              return d.category;
            });

          chart.selectAll('values')
            .data(data)
            .enter()
            .append('text')
            .attr('fill', '#fff')
            .attr('y', function(d, i) {
              return i * (barHeight + barGap) + 15;
            })
            .attr('x', (graphOrigin + 5))
            .attr('text-anchor', 'start')
            .text(function(d) {
              return d.amount;
            });

        };

        /**
         * We wrap our function with scope.$apply() to force $digest to rerun and update the values that have changed.
         */
        $window.onresize = function() {
          scope.$apply(scope.drawGraph(scope.data));
        };

        scope.drawGraph(scope.data);

      },

      template: '<div id="chart"></div>'
    };
  }]);