'use strict';

angular.module('vppApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('main', {
                url: "/",
                templateUrl: 'app/main/main.html',
                controller: 'MainCtrl'
            })
            .state('home', {
                url: "/home",
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
		                        Map: 'esri/map',
		                        FeatureLayer: 'esri/layers/FeatureLayer',
		                        InfoTemplate: 'esri/InfoTemplate',
		                        SimpleFillSymbol: 'esri/symbols/SimpleFillSymbol',
		                        SimpleRenderer: 'esri/renderers/SimpleRenderer',
		                        SimpleMarkerSymbol: 'esri/symbols/SimpleMarkerSymbol',
		                        ScaleDependentRenderer: 'esri/renderers/ScaleDependentRenderer',
		                        Color: 'dojo/_base/Color'
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
            });
    })
    .service('wish', function () {
	
	    // it's not require... it's a wish?
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