'use strict';

angular.module('vppApp')
	.controller('HelpCtrl', [
		'$scope',
		'$timeout',
		function ($scope, $timeout) {
		
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
			
			$scope.navTrigger();
		}
	]
);