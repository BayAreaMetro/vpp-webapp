'use strict';

angular.module('vppApp')
    .controller('DatabaseCtrl', [
  '$scope',
  '$http',
  function ($scope, $http) {
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
            $scope.sanValue = 1;
            $scope.geninfoData;
            $scope.supplyBothData;
            $scope.supplyOffStreetData;
            $scope.supplyOnStreetData;


            //Data Builder
            //Load data for Study Area Search Function
            $.ajax({
                dataType: 'json',
                url: publicDataURL + '/data/studyareas',
                success: function (data) {
                    //console.clear();
                    //console.log(data);
                    for (var i = 0; i < data.length; i++) {
                        $("#studyareas-list").append('<option data-number=' + data[i].Project_ID + '>' + data[i].Name + '</option>');
                    }
                }
            });



            //THIS TOOL NEEDS TO BE WIRED UP TO THE SHOW DATA AND DOWNLOAD DATA FUNCTION
            $(".find-studyarea").change(function () {
                var param = $("#StudyAreaSearch").val();

                $scope.sanValue = $('#studyareas-list option').filter(function () {
                    return this.value == param;
                    //console.log(this);
                }).data('number');

                //load Data for CollectionYear
                $.ajax({
                    dataType: 'json',
                    url: publicDataURL + '/data/collectionyear?sa=' + $scope.sanValue,
                    success: function (data) {
                        //console.clear();
                        //console.log(data);
                        $scope.sa = data;
                        for (var i = 0; i < data.length; i++) {
                            $("#collectionyear-list").append('<option data-number=' + data[i].CollectionYear + '>' + data[i].CollectionYear + '</option>');
                        }
                        $('#selectCollectionYear').val(data[0].CollectionYear);
                    }
                });

            });

            $('#dbSummaryMI').click(function () {
                $("#DataSummary").fadeIn(500);
                $("#DataTable").fadeOut(0, function () {
                    //                    $("#Policies").fadeOut(0);
                });

            });


            $('#vwDataBTN').click(function () {
                $("#DataTable").fadeIn(500);
                $("#DataSummary").fadeOut(0, function () {

                    //http request for gen info
                    $http({
                        url: publicDataURL + '/data/geninfo?sa=' + $scope.sanValue,
                        method: 'GET'
                    }).success(function (results) {
                        $scope.geninfoData = results;
                    }).error(function (data, status) {
                        console.log("There was an error:", status);
                    });
                    //End of http request for gen info.

                    //http request for Master Summary Data
                    $http({
                        url: devDataUrl + '/data/summary?sa=' + $scope.sanValue,
                        method: 'GET'
                    }).success(function (results) {
                        $scope.MasterSummaryData = results;

                    }).error(function (data, status) {
                        console.log("There was an error:", status);

                    });
                    //End of http request

                });
            });

            $('#vwOptionsBTN').click(function () {
                $("#DataSummary").fadeIn(500);
                $("#DataTable").fadeOut(0, function () {

                });
            });
            //End of Page Controls


            $("input[type=\"checkbox\"], input[type=\"radio\"]").not("[data-switch-no-init]").bootstrapSwitch();

            $("input[type=\"checkbox\"], input[type=\"radio\"]").on('switchChange.bootstrapSwitch', function (event, state) {
                var cat = $(this).attr('name');
                //console.log(cat); // DOM element                
                //console.log(state); // true | false

                if (state) {
                    switch (cat) {
                    case "ShowAll":
                        $("#ParkingSupply").fadeIn(0, function () {

                        });
                        $("#SpaceType").fadeIn(0);
                        $("#PricingInfo").fadeIn(0);
                        $("#RestrictionInfo").fadeIn(0);
                        $("#WDOccInfo").fadeIn(0);
                        $("#WEOccInfo").fadeIn(0);
                        $("#AddtnlResources").fadeIn(0);


                        break;
                    case "Pricing":
                        $("#PricingInfo").fadeIn(0);

                        break;
                    case "Supply":
                        $("#ParkingSupply").fadeIn(0, function () {

                        });

                        break;
                    case "Restrictions":
                        $("#RestrictionInfo").fadeIn(0);

                        break;
                    case "SpaceTypes":
                        $("#SpaceType").fadeIn(0);

                        break;
                    case "WDOccupancy":
                        $("#WDOccInfo").fadeIn(0);

                        break;
                    case "WEOccupancy":
                        $("#WEOccInfo").fadeIn(0);

                        break;
                    case "Resources":
                        $("#AddtnlResources").fadeIn(0);

                        break;

                    }
                } else {
                    switch (cat) {
                    case "ShowAll":
                        $("#ParkingSupply").fadeOut(0);
                        $("#SpaceType").fadeOut(0);
                        $("#PricingInfo").fadeOut(0);
                        $("#RestrictionInfo").fadeOut(0);
                        $("#WDOccInfo").fadeOut(0);
                        $("#WEOccInfo").fadeOut(0);
                        $("#AddtnlResources").fadeOut(0);

                        break;
                    case "Pricing":
                        $("#PricingInfo").fadeOut(0);

                        break;
                    case "Supply":
                        $("#ParkingSupply").fadeOut(0);

                        break;
                    case "Restrictions":
                        $("#RestrictionInfo").fadeOut(0);

                        break;
                    case "SpaceTypes":
                        $("#SpaceType").fadeOut(0);

                        break;
                    case "WDOccupancy":
                        $("#WDOccInfo").fadeOut(0);

                        break;
                    case "WEOccupancy":
                        $("#WEOccInfo").fadeOut(0);

                        break;
                    case "Resources":
                        $("#AddtnlResources").fadeOut(0);

                        break;

                    }
                }

            });


  }
 ]);