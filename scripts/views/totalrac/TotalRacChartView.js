/*
|--------------------------------------------------------------------------
| Total Rac Chart View                       views/totalrac/TotalRacView.js
|--------------------------------------------------------------------------
*/
define([
    'jquery',
    'backbone',
    'highstock',
    'models/TotalRacModel',
    'collections/TotalRacCollection',
    'views/BaseChartView'
], function ($, Backbone, Highstock, TotalRacModel, TotalRacCollection, BaseChartView) {


    /**
     * Helper extension for accessing methods in the parent object
     * @example this._super('parentMethod')
     * @link http://forrst.com/posts/Backbone_js_super_function-4co
     */
    Backbone.View.prototype._super = function (method) {

        return this.constructor.__super__[method].apply(this, _.rest(arguments));
    };


    var TotalRacChartView = BaseChartView.extend({

        defaultOptions: {
            page: {
                title: 'User RAC History'
            },
            title: {
                // text: 'User RAC History'
            }
        },

        initialize: function (options) {

            $.extend(true, options, this.defaultOptions);

            this._super('initialize', options);
            this.model      = new TotalRacModel();
            this.collection = new TotalRacCollection();
        }

    });

    return TotalRacChartView;
});