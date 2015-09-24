'use strict';

angular.module('vppApp')
    .controller("NavLargeCtrl", [
    	'$scope', 
    	function ($scope) {
	    	
	    	$scope.isActive = true;
	    	
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
			
			$scope.active = function(e){
				$scope.name = $(e.target).attr("name");
				if($scope.name === "research"){
					$('.inner-ul').removeClass("hidden");
				} else{
					$('.inner-ul').addClass("hidden");
					console.log("false");
				}
				
				$('.navbar-nav > li > a').removeClass('active');
				$(e.target).addClass("active");
			};
    	}
    ]	
);