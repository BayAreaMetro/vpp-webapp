'use strict';

angular.module('vppApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('main', {
                url: "/main",
                templateUrl: 'app/main/main.html',
                controller: 'MainCtrl'
            })
            .state('home', {
                url: "/",
                templateUrl: 'public/templates/home/home.html',
                controller: 'HomeCtrl'
            })
            .state('map', {
                url: "/map",
                templateUrl: 'public/templates/mapping/mapping.html',
                controller: 'MapCtrl',
                resolve: {
                    promiseObj: function ($q, $rootScope, wish) {
                        var deferred = $q.defer(),
                            deps = {

                                //ESRI Map
                                Map: 'esri/map',
                                esriConfig: 'esri/config',
                                HomeButton: 'esri/dijit/HomeButton',
                                //Map Layer Tools
                                FeatureLayer: 'esri/layers/FeatureLayer',
                                GraphicsLayer: 'esri/layers/GraphicsLayer',
                                DataAdapterFeatureLayer: 'esri/layers/DataAdapterFeatureLayer',
                                arcgisUtils: 'esri/arcgis/utils',
                                LayerList: 'esri/dijit/LayerList',
                                Graphic: 'esri/graphic',
                                esriLang: 'esri/lang',
                                ArcGISDynamicMapServiceLayer: 'esri/layers/ArcGISDynamicMapServiceLayer',
                                //ImageParameters: 'esri/layers/ImageParameters',
                                //ClusterLayer: 'extras/ClusterLayer',
                                //Map Popup Tools
                                Popup: 'esri/dijit/Popup',
                                dijitPopup: 'dijit/popup',
                                PopupTemplate: 'esri/dijit/PopupTemplate',
                                InfoTemplate: 'esri/InfoTemplate',
                                connect: "dojo/_base/connect",
                                TooltipDialog:'dijit/TooltipDialog',
                                //Symbol Tools
                                SimpleFillSymbol: 'esri/symbols/SimpleFillSymbol',
                                SimpleMarkerSymbol: 'esri/symbols/SimpleMarkerSymbol',
                                SimpleLineSymbol: 'esri/symbols/SimpleLineSymbol',
                                TextSymbol: 'esri/symbols/TextSymbol',
                                PictureMarkerSymbol: 'esri/symbols/PictureMarkerSymbol',
                                //dojo Stuff
                                Color: 'dojo/_base/Color',
                                parser: 'dojo/parser',
                                GreySkies: 'dojox/charting/themes/GreySkies',
                                number: 'dojo/number',
                                dom: 'dojo/dom',
                                on: 'dojo/on',
                                query: 'dojo/query',
                                domStyle: 'dojo/dom-style',
                                domConstruct: 'dojo/dom-construct',
                                registry: 'dijit/registry',
                                domReady: 'dojo/domReady',
                                arrayUtils: 'dojo/_base/array',
                                //Services
                                GeometryService: 'esri/tasks/GeometryService',
                                Extent: 'esri/geometry/Extent',
                                SpatialReference: 'esri/SpatialReference',
                                //Renderers
                                HeatmapRenderer: 'esri/renderers/HeatmapRenderer',
                                ClassBreaksRenderer: 'esri/renderers/ClassBreaksRenderer',
                                SimpleRenderer: 'esri/renderers/SimpleRenderer',
                                ScaleDependentRenderer: 'esri/renderers/ScaleDependentRenderer',
                                UniqueValueRenderer: 'esri/renderers/UniqueValueRenderer',
                                jsonUtil: 'esri/renderers/jsonUtils',
                                //MapQueryTools
                                QueryTask: 'esri/tasks/QueryTask',
                                Query: 'esri/tasks/query',
                                //Legend
                                Legend: 'esri/dijit/Legend',
                                LabelLayer: 'esri/layers/LabelLayer'
                            };



                        wish.loadDependencies(deps, function () {
                            deferred.resolve();
                            if (!$rootScope.$$phase) {
                                $rootScope.$apply();
                            }
                        });

                        return deferred.promise;
                    }
                }
            })
            .state('database', {
                url: "/database",
                templateUrl: 'public/templates/database/database.html',
                controller: 'DatabaseCtrl'
            })
            .state('about', {
                url: "/about",
                templateUrl: 'public/templates/about/about.html',
                controller: 'AboutCtrl'
            })
            .state('research', {
                url: "/research",
                templateUrl: 'public/templates/research/research.html',
                controller: 'ResearchCtrl'
            })
            .state('employees', {
                url: "/research.employees",
                templateUrl: 'public/templates/research/employees.html'
            })
            .state('regional', {
                url: "/research.regional",
                templateUrl: 'public/templates/research/regional.html'
            })
            .state('enacting', {
                url: "/research.enacting",
                templateUrl: 'public/templates/research/enacting.html'
            })
            .state('resources', {
                url: "/research.resources",
                templateUrl: 'public/templates/research/resources.html'
            })
            .state('policy', {
                url: "/research.policy",
                templateUrl: 'public/templates/research/policy.html'
            })
            .state('overview', {
                url: "/research.policy.overview",
                templateUrl: 'public/templates/research/policy-overview.html'
            })
            .state('ubanSim', {
                url: "/research.policy.ubanSim",
                templateUrl: 'public/templates/research/policy-ubanSim.html'
            })
            .state('modalOne', {
                url: "/research.policy.modalOne",
                templateUrl: 'public/templates/research/policy-modalOne.html'
            })
            .state('key', {
                url: "/research.policy.key",
                templateUrl: 'public/templates/research/policy-key.html'
            })
            .state('pr', {
                url: "/research.pr",
                templateUrl: 'public/templates/research/pr.html'
            })
            .state('parking', {
                url: "/research.parking",
                templateUrl: 'public/templates/research/parking.html'
            })
            .state('travel', {
                url: "/research.parking.travel",
                templateUrl: 'public/templates/research/travel.html'
            })
            .state('supply', {
                url: "/research.supply",
                templateUrl: 'public/templates/research/supply.html'
            })
            .state('help', {
                url: "/help",
                templateUrl: 'public/templates/help/help.html',
                controller: 'HelpCtrl',
                controllerAs: 'vm'
            })
            .state('feedback', {
                url: "/feedback",
                templateUrl: 'public/templates/feedback/feedback.html',
                controller: 'FeedbackCtrl'
            });
    })
    .service('wish', function () {

        var wish = {};

        function _loadDependencies(deps, next) {
            var reqArr = _.values(deps),
                keysArr = _.keys(deps);

            // use the dojo require (required by arcgis + dojo) && save refs
            // to required obs
            require(reqArr, function () {
                var args = arguments;

                _.each(keysArr, function (name, idx) {
                    wish[name] = args[idx];
                });

                next();
            });
        }

        return {
            loadDependencies: function (deps, next) {
                _loadDependencies(deps, next);
            },

            get: function () {
                return wish;
            }
        };
    });