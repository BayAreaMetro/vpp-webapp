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
            //Summary Data URLs
            var devDataUrl = "http://localhost:3003";
            var publicDataURL = "http://vpp-data-api.elasticbeanstalk.com";

            //Data Builder
            //Load data for Study Area Search Function
            $.ajax({
                dataType: 'json',
                url: devDataUrl + '/data/studyareas',
                success: function (data) {
                    //console.clear();
                    //console.log(data);
                    for (var i = 0; i < data.length; i++) {
                        $("#studyareas-list").append('<option data-number=' + data[i].Project_ID + '>' + data[i].Name + '</option>');
                    }
                }
            });



            //THIS TOOL NEEDS TO BE WIRED UP TO THE SHOW DATA AND DOWNLOAD DATA FUNCTION
            $(".find - studyarea").change(function () {
                var param = $("#StudyAreaSearch").val();
                //                var sanValue = $('#studyareas-list option').filter(function () {
                //                    return this.value == san;
                //                    //console.log(this);
                //                }).data('number');

                //load Data for CollectionYear
                $.ajax({
                    dataType: 'json',
                    url: devDataUrl + '/data/collectionyear?sa=' + param,
                    success: function (data) {
                        //console.clear();
                        //console.log(data);
                        $scope.sa = data;
                        for (var i = 0; i < data.length; i++) {
                            $("#collectionyear-list").append('<option data-number=' + data[i].CollectionYear + '>' + data[i].CollectionYear + '</option>');
                        }
                    }
                });


            });

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