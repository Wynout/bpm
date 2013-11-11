/*
|--------------------------------------------------------------------------
| Total Rac View                 app/scripts/views/totalrac/TotalRacView.js
|--------------------------------------------------------------------------
*/
define([
    'jquery',
    'backbone',
    'highstock',
    'highstock-theme'
    /*,
    'views/totalrac/TotalRacChartView',
    'text!templates/totalrac/TotalRacView.html'*/
], function ($, Backbone, Highstock) {

    return Backbone.View.extend({

        el: $('#total-rac'),

        model: null,
        page: null,

        options: {
            chart:{

            },

            yAxis: {
                labels: {
                    // formatter: function() {
                    //     return (this.value > 0 ? '+' : '') + this.value + '%';
                    // }
                },
                plotLines: [{
                    value: 0,
                    width: 2,
                    color: 'silver'
                }]
            },

            plotOptions: {
                series: {
                    dataGrouping: {
                        enabled: true
                    }
                }
            },
            tooltip: {
                // formatter: function() {
                //     var s = '<b>'+ this.x +'</b>';

                //     $.each(this.points, function(i, point) {
                //         s += '<br/>'+ point.series.name +': '+
                //             point.y +'m';
                //     });

                //     return s;
                // },
                shared: true
            }
        },

        initialize: function () {

            var self = this;

            this.options.chart.renderTo = 'total-rac-chart';

            App.vent.on('projectTotalRac:showSingle', this.showSingle, this);
            App.vent.on('projectTotalRac:showAll', this.showAll, this);

            this.$el.on('pageshow', function (event, data) {

                self.render();
            });
        },


        showSingle: function (projectId) {

            var self = this;
            App.Models.TotalRac.id = projectId;
            App.Models.TotalRac.fetch({
                success: function () {

                    self.model = App.Models.TotalRac;
                    self.page  = null;

                    $.mobile.changePage('#total-rac', {reverse: false, changeHash: true});
                }
            }).always(function () {

            });
        },


        showAll: function (page) {

            page = (page===null || page===undefined) ? 1 : page;

            var self = this;
            App.Collections.TotalRac.id = page;
            App.Collections.TotalRac.fetch({data: {page: page}}).then(function (response) {

                if (response[0]) {
                    response = response[0];
                }

                self.model = null;
                self.page  = response;
                $.mobile.changePage('#total-rac', {reverse: false, changeHash: true});

            }, function (error) {

                console.log(error);
            });
        },


        render: function () {

            var self = this;

            if (this.chart===undefined) {

                this.chart = new Highcharts.StockChart(this.options);
            }

            this.chart.showLoading();

            while (this.chart.series.length > 0) {

                this.chart.series[0].remove(true);
            }

            var title = '';

            // $('#totalUserRacHistories h1').text('project.name');


            if (!_.isNull(this.model)) {

                var project = this.model.get('project');

                title = 'Total RAC for project ' + project.name;

                this.chart.addSeries({
                    name: project.name ,
                    pointStart: this.model.get('start_timestamp')*1000,
                    pointInterval: 24*3600*1000,
                    data: this.model.get('rac'),
                }, false);


            } else if (!_.isNull(this.page)) {

                title = 'Total RAC for projects';

                _.each(this.page.results, function (result, index) {

                    self.chart.addSeries({
                        name: result.project.name,
                        pointStart: result.start_timestamp*1000,
                        pointInterval: 24*3600*1000,
                        data: result.rac,
                    }, false);
                });
            }

            this.chart.setTitle({text: title});
            this.chart.redraw();
            this.chart.hideLoading();
            return this;

        }
    });
});