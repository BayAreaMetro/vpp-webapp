'use strict';

angular.module('vppApp')
    .controller("NavLargeCtrl", [
    	'$scope', 
    	function ($scope) {
	    	
	    	//Show nav
			$scope.showInnerLinks = function(event){
				event.target.classList.add('show-inner');
				//$(event.target).addClass('show-inner');
				console.log('show');
			}
			
			//Hide nav
			$scope.hideInnerLinks = function(event){
				event.target.classList.remove('show-inner');
				//$(".nav-list").removeClass('show-inner');
				console.log('hide');
			}
    	}
    ]	
);