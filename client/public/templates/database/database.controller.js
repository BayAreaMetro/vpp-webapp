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
            var sanValue;
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

            //            $('#dbPoliciesMI').click(function () {
            //                $("#Policies").fadeIn(500);
            //                $("#DataTable").fadeOut(0, function () {
            //                    $("#DataSummary").fadeOut(0);
            //                });
            //            });

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
                    //end of http request for gen info.
                    //http request for supply both data
                    $http({
                        url: publicDataURL + '/data/supplyboth?sa=' + $scope.sanValue,
                        method: 'GET'
                    }).success(function (results) {
                        $scope.supplyBothData = results;
                        console.log($scope.supplyBothData[0]);
                        $('#pst').text($scope.supplyBothData[0].Total_Spaces);
                        $('#urt').text($scope.supplyBothData[0].Unregulated_Spaces);
                        $('#tmrst').text($scope.supplyBothData[0].Time_and_Meter_Regulated_Spaces);
                        $('#trst').text($scope.supplyBothData[0].Time_Only_Regulated_Spaces);
                        $('#mrst').text($scope.supplyBothData[0].Meter_Only_Regulated_Spaces);
                        $('#ast').text($scope.supplyBothData[0].ADA_Spaces);
                        $('#mst').text($scope.supplyBothData[0].Motorcycle_Spaces);
                        $('#ltost').text($scope.supplyBothData[0].Loading_or_Other_Spaces);
                        $('#rpst').text($scope.supplyBothData[0].Permit_Reserved_Only_Spaces);
                        $('#sphst').text($scope.supplyBothData[0].Shared_Permit_Spaces);
                    }).error(function (data, status) {
                        console.log("There was an error:", status);
                    });
                    //http request for supply off-street data
                    $http({
                        url: publicDataURL + '/data/supplyoffstreet?sa=' + $scope.sanValue,
                        method: 'GET'
                    }).success(function (results) {
                        $scope.supplyOffStreetData = results;
                        $('#psoff').text($scope.supplyOffStreetData[0].Total_Spaces);
                        $('#uroff').text($scope.supplyOffStreetData[0].Unregulated_Spaces);
                        $('#tmrsoff').text($scope.supplyOffStreetData[0].Time_and_Meter_Regulated_Spaces);
                        $('#trsoff').text($scope.supplyOffStreetData[0].Time_Only_Regulated_Spaces);
                        $('#mrsoff').text($scope.supplyOffStreetData[0].Meter_Only_Regulated_Spaces);
                        $('#asoff').text($scope.supplyOffStreetData[0].ADA_Spaces);
                        $('#msoff').text($scope.supplyOffStreetData[0].Motorcycle_Spaces);
                        $('#ltosoff').text($scope.supplyOffStreetData[0].Loading_or_Other_Spaces);
                        $('#rpsoff').text($scope.supplyOffStreetData[0].Permit_Reserved_Only_Spaces);
                        $('#sphsoff').text($scope.supplyOffStreetData[0].Shared_Permit_Spaces);
                    }).error(function (data, status) {
                        console.log("There was an error:", status);
                    });
                    //http request for supply on-street data
                    $http({
                        url: publicDataURL + '/data/supplyonstreet?sa=' + $scope.sanValue,
                        method: 'GET'
                    }).success(function (results) {
                        $scope.supplyOnStreetData = results;

                        $('#pso').text($scope.supplyOnStreetData[0].Total_Spaces);
                        $('#uro').text($scope.supplyOnStreetData[0].Unregulated_Spaces);
                        $('#tmrso').text($scope.supplyOnStreetData[0].Time_and_Meter_Regulated_Spaces);
                        $('#trso').text($scope.supplyOnStreetData[0].Time_Only_Regulated_Spaces);
                        $('#mrso').text($scope.supplyOnStreetData[0].Meter_Only_Regulated_Spaces);
                        $('#aso').text($scope.supplyOnStreetData[0].ADA_Spaces);
                        $('#mso').text($scope.supplyOnStreetData[0].Motorcycle_Spaces);
                        $('#ltoso').text($scope.supplyOnStreetData[0].Loading_or_Other_Spaces);
                        $('#rpso').text($scope.supplyOnStreetData[0].Permit_Reserved_Only_Spaces);
                        $('#sphso').text($scope.supplyOnStreetData[0].Shared_Permit_Spaces);

                    }).error(function (data, status) {
                        console.log("There was an error:", status);
                    });
                });
                //$('#psoPct').text($('#pso').val() / $('#psoff').val());
            });

            function populateForm() {
                //                console.log($scope.supplyBothData);
                //                console.log($scope.supplyOffStreetData);

            }

            $('#vwOptionsBTN').click(function () {
                $("#DataSummary").fadeIn(500);
                $("#DataTable").fadeOut(0, function () {
                    //                    $("#DataTable").fadeOut(0);
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
                        $("#PricingInfo").show();

                        break;
                    case "Supply":
                        $("#ParkingSupply").fadeIn(0, function () {

                        });

                        break;
                    case "Restrictions":
                        $("#RestrictionInfo").show();

                        break;
                    case "SpaceTypes":
                        $("#SpaceType").show();

                        break;
                    case "WDOccupancy":
                        $("#WDOccInfo").show();

                        break;
                    case "WEOccupancy":
                        $("#WEOccInfo").show();

                        break;
                    case "Resources":
                        $("#AddtnlResources").show();

                        break;

                    }
                } else {
                    switch (cat) {
                    case "ShowAll":
                        $("#ParkingSupply").hide();
                        $("#SpaceType").hide();
                        $("#PricingInfo").hide();
                        $("#RestrictionInfo").hide();
                        $("#WDOccInfo").hide();
                        $("#WEOccInfo").hide();
                        $("#AddtnlResources").hide();

                        break;
                    case "Pricing":
                        $("#PricingInfo").hide();

                        break;
                    case "Supply":
                        $("#ParkingSupply").hide();

                        break;
                    case "Restrictions":
                        $("#RestrictionInfo").hide();

                        break;
                    case "SpaceTypes":
                        $("#SpaceType").hide();

                        break;
                    case "WDOccupancy":
                        $("#WDOccInfo").hide();

                        break;
                    case "WEOccupancy":
                        $("#WEOccInfo").hide();

                        break;
                    case "Resources":
                        $("#AddtnlResources").hide();

                        break;

                    }
                }

            });


  }
 ]);