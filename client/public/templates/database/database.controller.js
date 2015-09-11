'use strict';

angular.module('vppApp')
    .controller('DatabaseCtrl', [
  '$scope',
  function ($scope) {
            //Page Controls
            //            $('.divControl').click(function () {
            //                $(".divFade").each(function () {
            //                    if ($('.divFade').css("visibility") == "hidden") {
            //                        // handle non visible state
            //                    } else {
            //                        // handle visible state
            //                        $('.divFade').fadeOut(0);
            //                    }
            //                });
            //            });

            $('#dbSummaryMI').click(function () {
                $("#DataSummary").fadeIn(500);
                $("#DataTable").fadeOut(0, function () {
                    $("#Policies").fadeOut(0);
                });

            });

            $('#dbPoliciesMI').click(function () {
                $("#Policies").fadeIn(500);
                $("#DataTable").fadeOut(0, function () {
                    $("#DataSummary").fadeOut(0);
                });
            });

            $('#vwDataBTN').click(function () {
                $("#DataTable").fadeIn(500);
                $("#Policies").fadeOut(0, function () {
                    $("#DataSummary").fadeOut(0);
                });
            });

            $('#vwOptionsBTN').click(function () {
                $("#DataSummary").fadeIn(500);
                $("#Policies").fadeOut(0, function () {
                    $("#DataTable").fadeOut(0);
                });
            });
            //End of Page Controls


            $("input[type=\"checkbox\"], input[type=\"radio\"]").not("[data-switch-no-init]").bootstrapSwitch();

            $("input[type=\"checkbox\"], input[type=\"radio\"]").on('switchChange.bootstrapSwitch', function (event, state) {
                //var LayerName = $(this).attr('name');

                console.log($(this).attr('name')); // DOM element
                //console.log(event); // jQuery event
                console.log(state); // true | false

                //            if (state) {
                //                switch (var) {
                //                case "":
                //                    
                //                    break;
                //                case "":
                //                    
                //                    break;
                //                case "":
                //                    
                //                    break;
                //
                //                }
                //            } else {
                //                switch (var) {
                //                case "":
                //                    
                //                    break;
                //                case "":
                //                    
                //                    break;
                //                case "":
                //                    
                //                    break;
                //                }
                //            }

            });

  }
 ]);