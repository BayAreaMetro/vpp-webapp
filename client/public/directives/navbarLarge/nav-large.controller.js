'use strict';

angular.module('vppApp')
    .controller("NavLargeCtrl", [
    	'$scope', 
    	function ($scope) {
	    	
	    	$scope.isActive = true;
	    	
	    	$scope.init = function(){
				$scope.navShow();
				$scope.navShowHelp();
			}
	    	
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
				
				//Get attr of anchor clicked
				$scope.name = $(e.target).attr("name");
				
				if($scope.name === "research"){
					$('.research-nav').removeClass("hidden");
					$('.data-nav').addClass("hidden");
					$('.about-nav').addClass("hidden");
					$('.help-nav').addClass("hidden");
				} else if($scope.name === "data"){
					$('.data-nav').removeClass("hidden");
					$('.research-nav').addClass("hidden");
					$('.about-nav').addClass("hidden");
					$('.help-nav').addClass("hidden");
				}else if($scope.name === "help"){
					$('.data-nav').addClass("hidden");
					$('.research-nav').addClass("hidden");
					$('.about-nav').addClass("hidden");
					$('.help-nav').removeClass("hidden");
				} else if($scope.name === "about"){
					$('.data-nav').addClass("hidden");
					$('.research-nav').addClass("hidden");
					$('.about-nav').removeClass("hidden");
					$('.help-nav').addClass("hidden");
				} else{
					$('.research-nav').addClass("hidden");
					$('.data-nav').addClass("hidden");
					$('.about-nav').addClass("hidden");
					$('.help-nav').addClass("hidden");
					console.log("false");
				}
				console.log($scope.name);
				//Add and remove active states
				$('.navbar-nav > li > a').removeClass('active');
				$(e.target).addClass("active");
			};
			
			$scope.inner = function(event){
				$scope.overview = false;
				
				//Get attr
				$scope.getLocation = $(event.target).attr("location");
				$scope.getElement = document.getElementById($scope.location);
				$scope.makeId = '"#' + $scope.getLocation +'"';
				
				//console.log('before');
				
				//Hide divs
				//$('.divFade').hide();RegionalPricingPolicies
				if ( $scope.getLocation === "EmployeePrograms" ){
					$('.divFade').hide();
					//Fadein section
					$("#EmployeePrograms").fadeIn();
				} else if ( $scope.getLocation === "RegionalPricingPolicies" ){
					
					$('.divFade').hide();
					//Fadein section
					$("#RegionalPricingPolicies").fadeIn();
				} else if ( $scope.getLocation === "Resources" ){
					
					$('.divFade').hide();
					//Fadein section
					$("#Resources").fadeIn();
				} else if ( $scope.getLocation === "EnactingPricingPolicies" ) {
					
					$('.divFade').hide();
					//Fadein section
					$("#EnactingPricingPolicies").fadeIn();
				} else if ( $scope.getLocation === "PolicyQuestions" ){
					
					$('.divFade').hide();
					//Fadein section
					$("#PolicyQuestions").fadeIn();
				} else if ( $scope.getLocation === "SupplyDemand" ){
					
					$('.divFade').hide();
					//Fadein section
					$("#SupplyDemand").fadeIn();
				} else if ( $scope.getLocation === "ParkingReqmntsUnbundling" ){			
					
					$('.divFade').hide();
					//Fadein section
					$("#ParkingReqmntsUnbundling").fadeIn();
				} else if( $scope.getLocation === "policy-overview" ){
					$('.divFade').hide();
					//Fadein section
					$("#EnactingPricingPolicies").fadeIn();
				} else if ( $scope.getLocation === "policy-urban" ){
					$('.divFade').hide();
					//Fadein section
					$("#policy-urban").fadeIn();
				} else if ( $scope.getLocation === "policy-travel" ){
					$('.divFade').hide();
					$("#policy-travel").fadeIn();
				} else if ( $scope.getLocation === "policy-key" ){
					$('.divFade').hide();
					$("#policy-key").fadeIn();
				} else if ( $scope.getLocation === "supply-overview" ){
					$('.divFade').hide();
					$("#supply-overview").fadeIn();
				} else if ( $scope.getLocation === "supply-parking" ){
					$('.divFade').hide();
					$("#supply-parking").fadeIn();
				} else if ( $scope.getLocation === "TravelModelOneAnalysis" ){
					$('.divFade').hide();
					$("#TravelModelOneAnalysis").fadeIn();
				} else if ( $scope.getLocation === "DataSummary" ){
					$('.divFade').hide();
					$("#DataSummary").fadeIn();
				} else if ( $scope.getLocation === "InventorySummary"){
					$('.divFade').hide();
					$("#InventorySummary").fadeIn();
				} else if( $scope.getLocation === "OccupancySummary"){
					$('.divFade').hide();
					$("#OccupancySummary").fadeIn();
				} else if ($scope.getLocation === "faqs"){
					$('.divFade').hide();
					$(".faqs-wrapper").fadeIn();
				} else if( $scope.getLocation === "contact"){
					$('.divFade').hide();
					$(".contact-wrapper").fadeIn();
				}
				console.log($scope.getLocation);
			}
			
			//About
			$scope.navShow = function(){
				$(".inner-nested-about").hover(function(){
					$('.about-nav').addClass('active');
					$('.inner-nested-about').addClass('active');
				},function(){
					$('.about-nav').removeClass('active');
					$('.inner-nested-about').removeClass('active');
				});
			};
			
			//Help
			$scope.navShowHelp = function(){
				$(".inner-nested-help").hover(function(){
					$('.about-nav').addClass('active');
					$('.inner-nested-help').addClass('active');
				},function(){
					$('.about-nav').removeClass('active');
					$('.inner-nested-help').removeClass('active');
				});
			};
			
			$scope.init();
    	}
    ]	
);