'use strict';

angular.module('vppApp')
    .controller('DatabaseCtrl', [
  '$scope',
  '$http',
  function ($scope, $http) {
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
            $scope.sanV = 1;
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
                $scope.StudyAreaName = $("#StudyAreaSearch").val();

                $scope.sanV = $('#studyareas-list option').filter(function () {
                    return this.value == $scope.StudyAreaName;

                }).data('number');

                //load Data for CollectionYear
                $.ajax({
                    dataType: 'json',
                    url: publicDataURL + '/data/collectionyear?sa=' + $scope.sanV,
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

            $('#dlSummaryDataBTN').click(function () {

                //http request for Master Summary Data
                $http({
                    url: publicDataURL + '/data/summary?sa=' + $scope.sanV,
                    method: 'GET'
                }).success(function (results) {
                    $scope.MasterSummaryData = results;
                    exportToCSV(results, $scope.StudyAreaName, true);

                }).error(function (data, status) {
                    console.log("There was an error:", status);

                });
                //End of http request

            });
            $('#dlInventoryDataBTN').click(function () {
                $scope.ParkingType = $("#").val();
                //http request for Master Summary Data
                $http({
                    url: publicDataURL + '/data/inventoryon?sa=' + $scope.sanV,
                    method: 'GET'
                }).success(function (results) {
                    $scope.InventorySummaryData = results;
                    exportToCSV(results, $scope.StudyAreaName, true);

                }).error(function (data, status) {
                    console.log("There was an error:", status);

                });
                $http({
                    url: publicDataURL + '/data/inventoryoff?sa=' + $scope.sanV,
                    method: 'GET'
                }).success(function (results) {
                    $scope.InventorySummaryData = results;
                    exportToCSV(results, $scope.StudyAreaName, true);

                }).error(function (data, status) {
                    console.log("There was an error:", status);

                });
                //End of http request

            });

            function exportToCSV(data, SAName, ShowLabel) {
                var arrData = typeof data != 'object' ? JSON.parse(data) : data;

                var CSV = '';
                //Set Report title in first row or line

                CSV += SAName + '\r\n\n';

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
                var fileName = "VPP_";
                //this will remove the blank-spaces from the title and replace it with an underscore
                fileName += SAName.replace(/ /g, "_");

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
                link.style = "visibility:hidden";
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
                        url: publicDataURL + '/data/geninfo?sa=' + $scope.sanV,
                        method: 'GET'
                    }).success(function (results) {
                        $scope.geninfoData = results;
                    }).error(function (data, status) {
                        console.log("There was an error:", status);
                    });
                    //End of http request for gen info.

                    //http request for Master Summary Data
                    $http({
                        url: publicDataURL + '/data/summary?sa=' + $scope.sanV,
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