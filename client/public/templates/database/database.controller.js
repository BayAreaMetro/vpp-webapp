'use strict';

angular.module('vppApp')
    .controller('DatabaseCtrl', [
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

            $('#dbSummaryMI').click(function () {
                $("#DataSummary").fadeIn(1000);
            });

            $('#dbPoliciesMI').click(function () {
                $("#Policies").fadeIn(1000);
            });

            $('#vwDataBTN').click(function () {
                $("#DataTable").fadeIn(1000);
            });

            $('#vwOptionsBTN').click(function () {
                $("#DataSummary").fadeIn(1000);
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