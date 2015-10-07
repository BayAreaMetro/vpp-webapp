'use strict';

angular.module('vppApp')
	.controller('AboutCtrl', [
		'$scope',
		function ($scope) {
			
			$scope.formActive;
			
			//Contact US
			$scope.activate = function () {
			    $scope.formActive = !$scope.formActive;
			};
		
		}
	]
);