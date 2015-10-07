'use strict';

angular.module('vppApp')
	.controller('HelpCtrl', [
		'$scope',
		'$timeout',
		function ($scope, $timeout) {
		
			$scope.navTrigger = function(){
				$(".inner-nested").hover(function(){
					$('.help-nav').addClass('active');
					$('.inner-nested').addClass('active');
				},function(){
					$('.help-nav').removeClass('active');
					$('.inner-nested').removeClass('active');
				});
				//console.log('help');
			};
			
			$scope.navTrigger();
		}
	]
);