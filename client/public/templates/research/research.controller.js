'use strict';

angular.module('vppApp')
    .controller('ResearchCtrl', [
		'$scope',
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
		}
	]
 );