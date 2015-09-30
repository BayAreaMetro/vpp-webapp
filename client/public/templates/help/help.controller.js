'use strict';

angular.module('vppApp')
	.controller('HelpCtrl', [
		'$scope',
		'$timeout',
		function($scope, $timeout){
			
			//Copy from here
			$scope.vm = this;

		    $scope.vm.priceSlider1 = {
		        floor: 0,
		        ceil: 500,
		        value: 100
		    };
		
		   $scope. vm.priceSlider2 = {
		        floor: 0,
		        ceil: 500,
		        value: 200
		    };
		
		    $scope.vm.refreshSlider = function () {
		        $timeout(function () {
		            $scope.$broadcast('rzSliderForceRender');
		        });
		    };
		    //End copy
		}
	]
)