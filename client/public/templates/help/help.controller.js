'use strict';

angular.module('vppApp')
	.controller('HelpCtrl', [
		'$scope',
		'$timeout',
		function($scope, $timeout){
			$scope.formActive;
			
			$scope.activate = function(){
				
				$scope.formActive = !$scope.formActive;
			};
			//Copy from here
		    //End copy
		}
	]
)