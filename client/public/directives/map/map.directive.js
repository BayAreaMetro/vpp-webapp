'use strict';

angular.module('vppApp')
	.directive('mapTemplate', function(){
		return{
			restrict: 'E',
			templateUrl: 'map/map.directive.html',
			controller: function(){
				console.log("stuff");
			}
		}
	}
);