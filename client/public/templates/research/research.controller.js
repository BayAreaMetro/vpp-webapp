'use strict';

angular.module('vppApp')
    .controller('ResearchCtrl', [
		'$scope',
	    '$http',
		function ($scope) {
			
			$scope.init = function(){
				$scope.test = "go";
				//$(".vpp-links")
				
				//Remove hiiden class
				//$('.inner-ul').removeClass('hidden');
				
				$(".inner-nested").hover(function(){
					$('.research-nav').addClass('active');
					$('.inner-nested').addClass('active');
				},function(){
					$('.research-nav').removeClass('active');
					$('.inner-nested').removeClass('active');
				});
				console.log('reseach');
			};
			
			$scope.init();
		}
	]
);