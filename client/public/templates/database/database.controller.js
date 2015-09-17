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

                    $scope.geninfoData;
                    $scope.supplyBothData;
                    $scope.supplyOffStreetData;
                    $scope.supplyOnStreetData;
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
                    }).error(function (data, status) {
                        console.log("There was an error:", status);
                    });
                    //http request for supply off-street data
                    $http({
                        url: publicDataURL + '/data/supplyoffstreet?sa=' + $scope.sanValue,
                        method: 'GET'
                    }).success(function (results) {
                        $scope.supplyOffStreetData = results;
                    }).error(function (data, status) {
                        console.log("There was an error:", status);
                    });
                    //http request for supply on-street data
                    $http({
                        url: publicDataURL + '/data/supplyonstreet?sa=' + $scope.sanValue,
                        method: 'GET'
                    }).success(function (results) {
                        $scope.supplyOnStreetData = results;
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
                            //                            $scope.ptype = $('#ParkingTypeSearch').val();
                            //                            $scope.supplyBothData;
                            //                            $scope.supplyOffStreetData;
                            //                            $scope.supplyOnStreetData;
                            //
                            //                            switch ($scope.ptype) {
                            //                            case "Both On/Off-Street":
                            //                                $http({
                            //                                    url: publicDataURL + '/data/supplyboth?sa=' + $scope.sanValue,
                            //                                    method: 'GET'
                            //                                }).success(function (results) {
                            //                                    $scope.supplyBothData = results;
                            //                                }).error(function (data, status) {
                            //                                    console.log("There was an error:", status);
                            //                                });
                            //                                break;
                            //                            case "Off-Street":
                            //                                $http({
                            //                                    url: publicDataURL + '/data/supplyoffstreet?sa=' + $scope.sanValue,
                            //                                    method: 'GET'
                            //                                }).success(function (results) {
                            //                                    $scope.supplyOffStreetData = results;
                            //                                }).error(function (data, status) {
                            //                                    console.log("There was an error:", status);
                            //                                });
                            //                                break;
                            //                            case "On-Street":
                            //                                $http({
                            //                                    url: publicDataURL + '/data/supplyonstreet?sa=' + $scope.sanValue,
                            //                                    method: 'GET'
                            //                                }).success(function (results) {
                            //                                    $scope.supplyOnStreetData = results;
                            //                                }).error(function (data, status) {
                            //                                    console.log("There was an error:", status);
                            //                                });
                            //                                break;
                            //                            }



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
                            //                            $scope.ptype = $('#ParkingTypeSearch').val();
                            //                            $scope.supplyBothData;
                            //                            $scope.supplyOffStreetData
                            //                            $scope.supplyOnStreetData
                            //
                            //                            switch ($scope.ptype) {
                            //                            case "Both On/Off-Street":
                            //                                $http({
                            //                                    url: publicDataURL + '/data/supplyboth?sa=' + $scope.sanValue,
                            //                                    method: 'GET'
                            //                                }).success(function (results) {
                            //                                    $scope.supplyBothData = results;
                            //                                }).error(function (data, status) {
                            //                                    console.log("There was an error:", status);
                            //                                });
                            //                                break;
                            //                            case "Off-Street":
                            //                                $http({
                            //                                    url: publicDataURL + '/data/supplyoffstreet?sa=' + $scope.sanValue,
                            //                                    method: 'GET'
                            //                                }).success(function (results) {
                            //                                    $scope.supplyOffStreetData = results;
                            //                                }).error(function (data, status) {
                            //                                    console.log("There was an error:", status);
                            //                                });
                            //                                break;
                            //                            case "On-Street":
                            //                                $http({
                            //                                    url: publicDataURL + '/data/supplyonstreet?sa=' + $scope.sanValue,
                            //                                    method: 'GET'
                            //                                }).success(function (results) {
                            //                                    $scope.supplyOnStreetData = results;
                            //                                }).error(function (data, status) {
                            //                                    console.log("There was an error:", status);
                            //                                });
                            //                                break;
                            //                            }
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