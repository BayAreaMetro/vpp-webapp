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

                    //http request for supply both data
                    $http({
                        url: publicDataURL + '/data/supplyboth?sa=' + $scope.sanValue,
                        method: 'GET'
                    }).success(function (results) {
                        $scope.supplyBothData = results;
                        //                        console.log($scope.supplyBothData[0]);
                        //$('#Total_Spaces_Tot').text($scope.supplyBothData[0].Total_Spaces);
                        $('#Unregulated_Spaces_Tot').text($scope.supplyBothData[0].Unregulated_Spaces);
                        $('#Time_and_Meter_Regulated_Spaces_Tot').text($scope.supplyBothData[0].Time_and_Meter_Regulated_Spaces);
                        $('#Time_Only_Regulated_Spaces_Tot').text($scope.supplyBothData[0].Time_Only_Regulated_Spaces);
                        $('#Meter_Only_Regulated_Spaces_Tot').text($scope.supplyBothData[0].Meter_Only_Regulated_Spaces);
                        $('#ADA_Spaces_Tot').text($scope.supplyBothData[0].ADA_Spaces);
                        $('#Motorcycle_Spaces_Tot').text($scope.supplyBothData[0].Motorcycle_Spaces);
                        $('#Loading_or_Other_Spaces_Tot').text($scope.supplyBothData[0].Loading_or_Other_Spaces);
                        $('#Permit_Reserved_Only_Spaces_Tot').text($scope.supplyBothData[0].Permit_Reserved_Only_Spaces);
                        $('#Shared_Permit_Spaces_Tot').text($scope.supplyBothData[0].Shared_Permit_Spaces);
                        //Pricing
                        $('#Total_Spaces_Priced_Tot').text($scope.supplyBothData[0].Total_Spaces_Priced);
                        $('#Pricing_Permit_Reserved_Only_Spaces_Tot').text($scope.supplyBothData[0].Permit_Reserved_Only_Spaces);
                        $('#Pricing_Shared_Permit_Spaces_Tot').text($scope.supplyBothData[0].Shared_Permit_Spaces);
                        //Time Restriction
                        $('#Time_Under_One_Hour_Tot').text($scope.supplyBothData[0].Time_Under_One_Hour);
                        $('#Time_One_Hour_Tot').text($scope.supplyBothData[0].Time_One_Hour);
                        $('#Time_Ninety_Mins_Tot').text($scope.supplyBothData[0].Time_Ninety_Mins);
                        $('#Time_Two_Hours_Tot').text($scope.supplyBothData[0].Time_Two_Hours);
                        $('#Time_3_to_4_Hours_Tot').text($scope.supplyBothData[0].Time_3_to_4_Hours);
                        $('#Time_More_Than_4_Hours_Tot').text($scope.supplyBothData[0].Time_More_Than_4_Hours);
                    }).error(function (data, status) {
                        console.log("There was an error:", status);
                    });
                    //http request for supply off-street data

                    $http({
                        url: publicDataURL + '/data/supplyoffstreet?sa=' + $scope.sanValue,
                        method: 'GET'
                    }).success(function (results) {
                        $scope.supplyOffStreetData = results;
                        //Supply
                        //$('#Total_Spaces_Off').text($scope.supplyOffStreetData[0].Total_Spaces);
                        //Type of Spaces
                        $('#Unregulated_Spaces_Off').text($scope.supplyOffStreetData[0].Unregulated_Spaces);
                        $('#Time_and_Meter_Regulated_Spaces_Off').text($scope.supplyOffStreetData[0].Time_and_Meter_Regulated_Spaces);
                        $('#Time_Only_Regulated_Spaces_Off').text($scope.supplyOffStreetData[0].Time_Only_Regulated_Spaces);
                        $('#Meter_Only_Regulated_Spaces_Off').text($scope.supplyOffStreetData[0].Meter_Only_Regulated_Spaces);
                        $('#ADA_Spaces_Off').text($scope.supplyOffStreetData[0].ADA_Spaces);
                        $('#Motorcycle_Spaces_Off').text($scope.supplyOffStreetData[0].Motorcycle_Spaces);
                        $('#Loading_or_Other_Spaces_Off').text($scope.supplyOffStreetData[0].Loading_or_Other_Spaces);
                        $('#Permit_Reserved_Only_Spaces_Off').text($scope.supplyOffStreetData[0].Permit_Reserved_Only_Spaces);
                        $('#Shared_Permit_Spaces_Off').text($scope.supplyOffStreetData[0].Shared_Permit_Spaces);
                        //Pricing
                        $('#Total_Spaces_Priced_Off').text($scope.supplyOffStreetData[0].Total_Spaces_Priced);
                        $('#Pricing_Permit_Reserved_Only_Spaces_Off').text($scope.supplyOnStreetData[0].Permit_Reserved_Only_Spaces);
                        $('#Pricing_Shared_Permit_Spaces_Off').text($scope.supplyOffStreetData[0].Shared_Permit_Spaces);
                        //Time Restriction
                        $('#Time_Under_One_Hour_Off').text($scope.supplyOffStreetData[0].Time_Under_One_Hour);
                        $('#Time_One_Hour_Off').text($scope.supplyOffStreetData[0].Time_One_Hour);
                        $('#Time_Ninety_Mins_Off').text($scope.supplyOffStreetData[0].Time_Ninety_Mins);
                        $('#Time_Two_Hours_Off').text($scope.supplyOffStreetData[0].Time_Two_Hours);
                        $('#Time_3_to_4_Hours_Off').text($scope.supplyOffStreetData[0].Time_3_to_4_Hours);
                        $('#Time_More_Than_4_Hours_Off').text($scope.supplyOffStreetData[0].Time_More_Than_4_Hours);

                    }).error(function (data, status) {
                        console.log("There was an error:", status);
                    });
                    //http request for supply on-street data
                    $http({
                        url: publicDataURL + '/data/supplyonstreet?sa=' + $scope.sanValue,
                        method: 'GET'
                    }).success(function (results) {
                        $scope.supplyOnStreetData = results;
                        //Supply
                        //$('#Total_Spaces_On').text($scope.supplyOnStreetData[0].Total_Spaces);
                        //Type of Spaces
                        $('#Unregulated_Spaces_On').text($scope.supplyOnStreetData[0].Unregulated_Spaces);
                        $('#Time_and_Meter_Regulated_Spaces_On').text($scope.supplyOnStreetData[0].Time_and_Meter_Regulated_Spaces);
                        $('#Time_Only_Regulated_Spaces_On').text($scope.supplyOnStreetData[0].Time_Only_Regulated_Spaces);
                        $('#Meter_Only_Regulated_Spaces_On').text($scope.supplyOnStreetData[0].Meter_Only_Regulated_Spaces);
                        $('#ADA_Spaces_On').text($scope.supplyOnStreetData[0].ADA_Spaces);
                        $('#Motorcycle_Spaces_On').text($scope.supplyOnStreetData[0].Motorcycle_Spaces);
                        $('#Loading_or_Other_Spaces_On').text($scope.supplyOnStreetData[0].Loading_or_Other_Spaces);
                        $('#Permit_Reserved_Only_Spaces_On').text($scope.supplyOnStreetData[0].Permit_Reserved_Only_Spaces);
                        $('#Shared_Permit_Spaces_On').text($scope.supplyOnStreetData[0].Shared_Permit_Spaces);
                        //Pricing
                        $('#Total_Spaces_Priced_On').text($scope.supplyOnStreetData[0].Total_Spaces_Priced);
                        $('#Pricing_Permit_Reserved_Only_Spaces_On').text($scope.supplyOnStreetData[0].Permit_Reserved_Only_Spaces);
                        $('#Pricing_Shared_Permit_Spaces_On').text($scope.supplyOnStreetData[0].Shared_Permit_Spaces);
                        //Time Restriction
                        $('#Time_Under_One_Hour_On').text($scope.supplyOnStreetData[0].Time_Under_One_Hour);
                        $('#Time_One_Hour_On').text($scope.supplyOnStreetData[0].Time_One_Hour);
                        $('#Time_Ninety_Mins_On').text($scope.supplyOnStreetData[0].Time_Ninety_Mins);
                        $('#Time_Two_Hours_On').text($scope.supplyOnStreetData[0].Time_Two_Hours);
                        $('#Time_3_to_4_Hours_On').text($scope.supplyOnStreetData[0].Time_3_to_4_Hours);
                        $('#Time_More_Than_4_Hours_On').text($scope.supplyOnStreetData[0].Time_More_Than_4_Hours);


                    }).error(function (data, status) {
                        console.log("There was an error:", status);
                    });
                });



            });



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