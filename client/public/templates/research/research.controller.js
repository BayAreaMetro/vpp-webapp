'use strict';

angular.module('vppApp')
    .controller('ResearchCtrl', [
	'$scope',
    '$http',
	function ($scope) {
	    //Page Controls
	    $('.divControl').click(function () {
	        $(".divFade").each(function () {
	            if ($('.divFade').css("visibility") == "hidden") {
	                // handle non visible state
	            } else {
	                // handle visible state
	                $('.divFade').fadeOut(10);
	            }
	        });
	    });
	
	    $('#resEmployeeProgramMI').click(function () {
	        $("#EmployeePrograms").fadeIn(1000);
	    });
	
	    $('#resRegPricingPolMI').click(function () {
	        $("#RegionalPricingPolicies").fadeIn(1000);
	    });
	
	    $('#resEnactingPricingPolicies').click(function () {
	        $("#EnactingPricingPolicies").fadeIn(1000);
	    });
	    $('#resResources').click(function () {
	        $("#Resources").fadeIn(1000);
	    });
	    $('#resPolicyQuestions').click(function () {
	        $("#PolicyQuestions").fadeIn(1000);
	    });
	    $('#resSupplyDemand').click(function () {
	        $("#SupplyDemand").fadeIn(1000);
	    });
	    $('#resParkingReqmntsUnbundling').click(function () {
	        $("#ParkingReqmntsUnbundling").fadeIn(1000);
	    });
	    $('#resTravelModelOneAnalysis').click(function () {
	        $("#TravelModelOneAnalysis").fadeIn(1000);
	    });
	    $('#policy-overview').click(function () {
	        $("#TravelModelOneAnalysis").fadeIn(1000);
	    });
		
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
 ]);