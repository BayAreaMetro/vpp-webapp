'use strict';

angular.module('vppApp')
	.controller('HelpCtrl', [
		'$scope',
		'$location',
		'$anchorScroll',
		'$timeout',
		function ($scope, $location, $anchorScroll, $timeout) {
		
			$scope.navTrigger = function(){
				$(".inner-nested-help").hover(function(){
					$('.help-nav').addClass('active');
					$('.inner-nested-help').addClass('active');
				},function(){
					$('.help-nav').removeClass('active');
					$('.inner-nested-help').removeClass('active');
				});
				console.log('help');
			};
			
			//$scope.navTrigger();

			$scope.gotoBottom = function(id) {
				//console.log(id);
				// set the location.hash to the id of
				// the element you wish to scroll to.
				$location.hash(id);
				
				// call $anchorScroll()
				$anchorScroll();
    		};
		}
	]
);



