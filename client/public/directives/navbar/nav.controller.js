'use strict';

angular.module('vppApp')
    .controller("NavCtrl", [
    	'$scope', 
    	function ($scope) {
	    	
	    	//Show nav
			$scope.showInnerLinks = function(event){
				$(".nav-list").addClass('show-inner');
				console.log('show');
			}
			
			//Hide nav
			$scope.hideInnerLinks = function(event){
				$(".nav-list").removeClass('show-inner');
				console.log('hide');
			}
    	}
    ]	
);