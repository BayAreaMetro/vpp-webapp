'use strict';
angular.module('vppApp')
    .controller('DataCtrl', [
	'$scope',
	function () {
	        //console.log('Data Controller');
	        //Page Controls
	        $('.divControl').click(function () {
	            $('.divFade').each(function () {
	                if ($('.divFade').css("visibility") == "hidden") {
	                    // handle non visible state
	                } else {
	                    // handle visible state
	                    $('.divFade').fadeOut(0);
	                }
	            });
	        });
	        $("#dbInventoryMI").click(function () {
	            $("#InventorySummary").fadeIn(500);
	        });
	        $('#dbSummaryMI').click(function () {
	            $("#DataSummary").fadeIn(500);
	        });
	        $('#dbOccupancyMI').click(function () {
	            $("#OccupancySummary").fadeIn(500);
	        });
	        $('#dbOverviewMI').click(function () {
	            //console.clear();
	            //console.log("Data Overview Loading...")
	        });
	}
 ]);