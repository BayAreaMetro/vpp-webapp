'use strict';
angular.module('vppApp')
    .controller('DatabaseCtrl', [
  '$scope',
  '$http',
  function ($scope, $http) {

            //Show and Hide vars
            $scope.isActive = false,
                $scope.showAll = false,
                $scope.pricing = false,
                $scope.supply = false,
                $scope.restrictions = false,
                $scope.spaceTypes = false,
                $scope.weekDay = false,
                $scope.weekEnd = false,
                $scope.resources = false;
            $scope.studyArea;
            $scope.selectedStudyArea = "Choose a Study Area...";
            $scope.selectedId;
            $scope.selectedCollectionYear = "Choose Collection Year...";
            $scope.selectedPtypeINV = "eg. On-Street, Off-Street";
            $scope.selectedPtypeOCC = "eg. On-Street, Off-Street, Both On/Off-Street";

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
            //Summary Data URLs
            var devDataUrl = "http://localhost:3003";
            var publicDataURL = "http://vpp-data-api.elasticbeanstalk.com";
            $scope.selectedId = 1;
            $scope.geninfoData;
            $scope.supplyBothData;
            $scope.supplyOffStreetData;
            $scope.supplyOnStreetData;


            //Data Builder
            //Load data for Study Area Search Function
            $http({
                url: publicDataURL + '/data/studyareas',
                method: 'GET'
            }).success(function (results) {
                $scope.studyArea = results;

            }).error(function (data, status) {
                console.log("There was an error:", status);

            });


            $scope.getStudyArea = function (event) {
                $scope.go = event.target;
                //console.log($scope.go);
            };
            $scope.getCollectionYear = function (event) {
                $scope.go = event.target;
                //console.log($scope.go1);
            };
            $scope.getPtypeINV = function (event) {
                $scope.go = event.target;
                //console.log($scope.go1);
            };
            $scope.getPtypeOCC = function (event) {
                $scope.go = event.target;
                //console.log($scope.go1);
            };
            //Create Data Object for Inventory Parking Type
            $scope.PtypeINV = [
                {
                    "Ptype": "ON",
                    "Description": "On-Street"

                    },
                {
                    "Ptype": "OFF",
                    "Description": "Off-Street"
                    }];
            //Create Data Object for Occupancy Parking Type
            $scope.PtypeOCC = [
                {
                    "Ptype": "ON",
                    "Description": "On-Street"

                    },
                {
                    "Ptype": "OFF",
                    "Description": "Off-Street"
                    },
                {
                    "Ptype": "BOTH",
                    "Description": "Both On/Off-Street"
                    }];

            //Drop down fix
            $(".ddStudyAreaSummary").on('click', '.study-li-summary', function (e) {
                //$scope.StudyAreaName = $(this).children('.selected-area').text();
                $scope.selectedStudyArea = $(this).children('.selected-area').text();
                $scope.selectedId = $(this).children('.selected-id').text();
                $http({
                    url: publicDataURL + '/data/collectionyear?sa=' + $scope.selectedId,
                    method: 'GET'
                }).success(function (results) {
                    $scope.cy = results;
                }).error(function (data, status) {
                    console.log("There was an error:", status);
                });
            });

            $(".ddCollectionYearSA").on('click', '.cy-li-studyArea', function (e) {
                $scope.selectedCollectionYear = $(this).children('.selected-year').text();
                $('.summaryVD').removeClass('disabled');
            });

            $(".ddStudyAreaInventory").on('click', '.study-li-inventory', function (e) {
                //$scope.StudyAreaName = $(this).children('.selected-area').text();
                $scope.selectedStudyArea = $(this).children('.selected-area').text();
                $scope.selectedId = $(this).children('.selected-id').text();
                //load Data for CollectionYear                
                $http({
                    url: publicDataURL + '/data/collectionyear?sa=' + $scope.selectedId,
                    method: 'GET'
                }).success(function (results) {
                    $scope.cy = results;
                }).error(function (data, status) {
                    console.log("There was an error:", status);
                });
            });

            $(".ddCollectionYearINV").on('click', '.cy-li-studyArea', function (e) {
                $scope.selectedCollectionYear = $(this).children('.selected-year').text();
                $('.inventoryVD').removeClass('disabled');
            });

            $(".ddStudyAreaOccupancy").on('click', '.study-li-occupancy', function (e) {
                $scope.selectedStudyArea = $(this).children('.selected-area').text();
                $scope.selectedId = $(this).children('.selected-id').text();

                //load Data for CollectionYear
                $http({
                    url: publicDataURL + '/data/collectionyear?sa=' + $scope.selectedId,
                    method: 'GET'
                }).success(function (results) {
                    $scope.cy = results;
                }).error(function (data, status) {
                    console.log("There was an error:", status);
                });
            });

            $(".ddCollectionYearOCC").on('click', '.cy-li-studyArea', function (e) {
                $scope.selectedCollectionYear = $(this).children('.selected-year').text();
                $('.occupancyVD').removeClass('disabled');
            });

            $('#vwMapSummaryBTN').click(function () {
                window.location.replace('#/map?sa=' + $scope.selectedId);
            });

            $('#dlSummaryDataBTN').click(function () {
                //http request for Master Summary Data
                $http({
                    url: publicDataURL + '/data/summary?sa=' + $scope.selectedId,
                    method: 'GET'
                }).success(function (results) {
                    $scope.MasterSummaryData = results;
                    exportToCSV(results, $scope.selectedStudyArea, 'Parking Data Summary', true);

                }).error(function (data, status) {
                    console.log("There was an error:", status);

                });
                //End of http request

            });
            $('#dlInventoryDataBTN').click(function () {
                $scope.ParkingType = $("#ParkingTypeSearchINV").val();

                console.clear();
                console.log($scope.ParkingType);


                switch ($scope.ParkingType) {
                case "Off-Street":
                    $http({
                        url: publicDataURL + '/data/inventoryoff?sa=' + $scope.selectedId,
                        method: 'GET'
                    }).success(function (results) {
                        $scope.InventorySummaryData = results;
                        exportToCSV(results, $scope.selectedStudyArea, 'Off-Street Inventory', true);

                    }).error(function (data, status) {
                        console.log("There was an error:", status);

                    });
                    break;
                case "On-Street":


                    $http({
                        url: publicDataURL + '/data/inventoryon?sa=' + $scope.selectedId,
                        method: 'GET'
                    }).success(function (results) {
                        $scope.InventorySummaryData = results;
                        exportToCSV(results, $scope.selectedStudyArea, 'On-Street Inventory', true);

                    }).error(function (data, status) {
                        console.log("There was an error:", status);

                    });
                    break;
                }



            });
            $('#dlOccupancyDataBTN').click(function () {
                $scope.ParkingType = $("#ParkingTypeSearchOCC").val();

                //console.clear();
                //console.log($scope.ParkingType);


                switch ($scope.ParkingType) {
                case "Off-Street":
                    $http({
                        url: publicDataURL + '/data/occupancyoff?sa=' + $scope.selectedId,
                        method: 'GET'
                    }).success(function (results) {
                        $scope.OccupancySummaryData = results;
                        exportToCSV(results, $scope.selectedStudyArea, 'Off-Street Occupancy', true);

                    }).error(function (data, status) {
                        console.log("There was an error:", status);

                    });
                    break;
                case "On-Street":


                    $http({
                        url: publicDataURL + '/data/occupancyon?sa=' + $scope.selectedId,
                        method: 'GET'
                    }).success(function (results) {
                        $scope.OccupancySummaryData = results;
                        exportToCSV(results, $scope.selectedStudyArea, 'On-Street Occupancy', true);

                    }).error(function (data, status) {
                        console.log("There was an error:", status);

                    });
                    break;
                }



            });

            function exportToCSV(data, SAName, DataType, ShowLabel) {
                var arrData = typeof data != 'object' ? JSON.parse(data) : data;

                var CSV = '';
                //Set Report title in first row or line

                CSV += SAName + ': ' + DataType + '\r\n\n';

                //This condition will generate the Label/Header
                if (ShowLabel) {
                    var row = "";

                    //This loop will extract the label from 1st index of on array
                    for (var index in arrData[0]) {

                        //Now convert each value to string and comma-seprated
                        row += index + ',';
                    }

                    row = row.slice(0, -1);

                    //append Label row with line break
                    CSV += row + '\r\n';
                }

                //1st loop is to extract each row
                for (var i = 0; i < arrData.length; i++) {
                    var row = "";

                    //2nd loop will extract each column and convert it in string comma-seprated
                    for (var index in arrData[i]) {
                        row += '"' + arrData[i][index] + '",';
                    }

                    row.slice(0, row.length - 1);

                    //add a line break after each row
                    CSV += row + '\r\n';
                }

                if (CSV == '') {
                    alert("Invalid data");
                    return;
                }

                //Generate a file name
                var fileName = "VPP_Data" + $scope.selectedId;
                //this will remove the blank-spaces from the title and replace it with an underscore
                //fileName += SAName.replace(/ /g, "_");

                //Initialize file format you want csv or xls
                var uri = 'data:text/csv;charset=utf-8,' + escape(CSV);

                // Now the little tricky part.
                // you can use either>> window.open(uri);
                // but this will not work in some browsers
                // or you will not get the correct file extension    

                //this trick will generate a temp <a /> tag
                var link = document.createElement("a");
                link.href = uri;

                //set the visibility hidden so it will not effect on your web-layout
                link.style.visibility = "hidden";
                link.download = fileName + ".csv";

                //this part will append the anchor tag and remove it after automatic click
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

            };

            $('#vwDataBTN').click(function () {
                $("#DataTable").fadeIn(500);
                $("#DataSummary").fadeOut(0, function () {

                    //http request for gen info
                    $http({
                        url: publicDataURL + '/data/geninfo?sa=' + $scope.selectedId,
                        method: 'GET'
                    }).success(function (results) {
                        $scope.geninfoData = results;
                    }).error(function (data, status) {
                        console.log("There was an error:", status);
                    });
                    //End of http request for gen info.

                    //http request for Master Summary Data
                    $http({
                        url: publicDataURL + '/data/summary?sa=' + $scope.selectedId,
                        method: 'GET'
                    }).success(function (results) {
                        $scope.MasterSummaryData = results;

                    }).error(function (data, status) {
                        console.log("There was an error:", status);

                    });
                    //End of http request

                });
                //console.log($scope.pricing);
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
                console.log(cat); // DOM element                
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

                        $scope.showAll = true;
                        break;
                    case "Pricing":

                        $("#PricingInfo").fadeIn(0);

                        $scope.isActive = true;
                        break;
                    case "Supply":

                        $("#ParkingSupply").fadeIn(0, function () {

                        });

                        $scope.supply = true;
                        break;
                    case "Restrictions":
                        $("#RestrictionInfo").fadeIn(0);

                        $scope.restrictions = true;
                        break;
                    case "SpaceTypes":
                        $("#SpaceType").fadeIn(0);

                        $scope.spaceTypes = true;
                        break;
                    case "WDOccupancy":
                        $("#WDOccInfo").fadeIn(0);

                        $scope.weekDay = true;
                        break;
                    case "WEOccupancy":
                        $("#WEOccInfo").fadeIn(0);

                        $scope.weekEnd = true;
                        break;
                    case "Resources":
                        $("#AddtnlResources").fadeIn(0);

                        $scope.resources = true;
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

                        $scope.showAll = false;
                        break;
                    case "Pricing":
                        $("#PricingInfo").fadeOut(0);

                        $scope.isActive = false;
                        break;
                    case "Supply":
                        $("#ParkingSupply").fadeOut(0);

                        $scope.supply = false;
                        break;
                    case "Restrictions":
                        $("#RestrictionInfo").fadeOut(0);

                        $scope.restrictions = false;
                        break;
                    case "SpaceTypes":
                        $("#SpaceType").fadeOut(0);

                        $scope.spaceTypes = false;
                        break;
                    case "WDOccupancy":
                        $("#WDOccInfo").fadeOut(0);

                        $scope.weekDay = false;
                        break;
                    case "WEOccupancy":
                        $("#WEOccInfo").fadeOut(0);

                        $scope.weekEnd = false;
                        break;
                    case "Resources":
                        $("#AddtnlResources").fadeOut(0);

                        $scope.resources = false;
                        break;

                    }
                }

            });

            $scope.activeTrigger = function () {
                $(".inner-nested").hover(function () {
                    $('.data-nav').addClass('active');
                    $('.inner-nested').addClass('active');
                }, function () {
                    $('.data-nav').removeClass('active');
                    $('.inner-nested').removeClass('active');
                });
            };

            $scope.printer = function () {

                //Get Print Section
                $scope.createElement(document.getElementById("DataTable"));

                //Create the element
                //$scope.modThis = document.querySelector("#print-section .working");
                //$scope.modThis.appendChild(document.createTextNode(" new"));

                print();
            };

            $scope.createElement = function (element) {

                $scope.node = element.cloneNode(true);
                $scope.printerElement = document.getElementById("print-section");

                if (!$scope.printerElement) {
                    $scope.printerElement = document.createElement("div");
                    $scope.printerElement.id = "print-section";
                    document.body.appendChild($scope.printerElement);
                }

                $scope.printerElement.innerHTML = "";

                $scope.printerElement.appendChild($scope.node);
            };

            $scope.activeTrigger();
    }]);