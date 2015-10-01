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
                console.clear();
                console.log("Data Inventory Loading...");
            });
            $('#dbSummaryMI').click(function () {
                $("#DataSummary").fadeIn(500);
                console.clear();
                console.log("Data Summary Loading...");
            });
            $('#dbOccupancyMI').click(function () {
                $("#OccupancySummary").fadeIn(500);
                console.clear();
                console.log("Data Occupancy Loading...");
            });
            $('#dbOverviewMI').click(function () {
                console.clear();
                console.log("Data Overview Loading...");
            });
 }
 ]);