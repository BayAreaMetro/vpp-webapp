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
				
/*
				$(".inner-nested-research").hover(function(){
					$('.research-nav').addClass('active');
					$('.inner-nested-research').addClass('active');
					console.log('hover!!!!!!');
				},function(){
					$('.research-nav').removeClass('active');
					$('.inner-nested-research').removeClass('active');
				});
*/
				console.log('reseach!!!!!!');
			};
			
			$scope.init();
		}
	]
);