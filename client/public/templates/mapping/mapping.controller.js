'use strict';

angular.module('vppApp')
    .controller('MapCtrl', function ($rootScope, $scope, $http, wish) {

        //Vars always at the top
        $scope.layerOpacity;
        $scope.vm = this;
        $scope.isActiveTrans;
        $scope.isActiveDev;
        $scope.switchButtonDev = "Off";
        $scope.switchButtonTrans = "Off";
        $scope.studyArea;
        $scope.selectedStudyAreaMap = "Choose a Study Area...";
        $scope.selectedId;
        $scope.peakButton = false;
        $scope.timeButton = false;
//Nadia's branch
        var w = wish.get(),
            OnStreetInventoryFL,
            OffStreetInventoryFL,
            OnStreetRestrictionsFL,
            OffStreetRestrictionsFL,
            WDOnStreetOccupancyFL,
            WDOffStreetOccupancyFL,
            WEOnStreetOccupancyFL,
            WEOffStreetOccupancyFL,
            PeakOnStreetOccupancyFL,
            PeakOffStreetOccupancyFL,
            studyAreasFL,
            saLabelsFL,
            ImageParameters,
            // COC_FL,
            PDA_FL,
            FerryTerminalsFL,
            ParknRideLotsFL,
            //RailStationsFL,
            TransitHubsFL,
            TPAsFL,
            BartFL,
            CaltrainFL,
            AmtrakFL,
            LightRailFL,
            markerSym,
            renderer1,
            renderer2,
            sls,
            sfs,
            popup,
            popupOptions,
            parkingInspector,
            parkingInspectorOnStreet,
            parkingInspectorOffStreet,
            parkingInspectorRestrictionsOnStreet,
            parkingInspectorRestrictionsOffStreet,
            parkingInspectorWEOccupancyOnStreet,
            parkingInspectorWEOccupancyOffStreet,
            parkingInspectorWDOccupancyOnStreet,
            parkingInspectorWDOccupancyOffStreet,
            parkingInspectorPeakOccupancyOnStreet,
            parkingInspectorPeakOccupancyOffStreet,
            transitLayerInfo,
            symbol,
            symbol_OnStreetOccupancy,
            OffStreetInventoryURL,
            OnStreetInventoryURL,
            WDOffStreetOccupancyURL,
            WDOnStreetOccupancyURL,
            WEOffStreetOccupancyURL,
            WEOnStreetOccupancyURL,
            StudyAreaURL,
            FerryTerminalsURL,
            ParknRideLotsURL,
            RailStationsURL,
            TransitHubsURL,
            TPAsURL,
            StudyAreaQueryTask,
            saq_Color,
            saq_Line,
            saq_Symbol,
            saQuery,
            saInfoTemplate,
            vppGraphicsLayer,
            mapCenter,
            studyAreasColor,
            studyAreasLine,
            studyAreasSymbol,
            studyAreasRenderer,
            mapLevel,
            clusterLayer,
            selectedOpLayer,
            //Layer Opacity Settings
            PDAFLsv,
            PDAFLop,
            studyAreasFLsv,
            studyAreasFLop,
            TPAsFLsv,
            TPAsFLop,
            urlParmresults


        PDAFLsv = 30;
        PDAFLop = 0.3;
        studyAreasFLsv = 50;
        studyAreasFLop = 0.5;
        TPAsFLsv = 30;
        TPAsFLop = 0.3;
        $scope.legendBTN = false;
        $scope.TimePeriod = "Early Morning (5AM)";
        $scope.TODbtn = false;
        $scope.parkingType = "Both On/Off-Street Parking";
        $scope.PTbtn = false;
        $scope.showAll = true;
        $scope.printActive = false;
        $scope.printingMode = true;


        w.parser.parse();
        w.esriConfig.defaults.geometryService = new w.GeometryService("http://gis.mtc.ca.gov/mtc/rest/services/Utilities/Geometry/GeometryServer");


        sls = new w.SimpleLineSymbol("solid", new w.Color("#444444"), 2);
        sfs = new w.SimpleFillSymbol("solid", sls, new w.Color([68, 68, 68, 0.25]));

        popupOptions = {
            fillSymbol: sfs,
            marginLeft: "20",
            marginTop: "20"
        };

        //Summary Data URLs
        var devDataUrl = "http://localhost:3003";
        var publicDataURL = "http://vpp-data-api.elasticbeanstalk.com";

        //Inventory Data URLs
        OffStreetInventoryURL = 'http://gis.mtc.ca.gov/mtc/rest/services/VPP/Alpha_Map/MapServer/0';
        OnStreetInventoryURL = 'http://gis.mtc.ca.gov/mtc/rest/services/VPP/Alpha_Map/MapServer/1';

        //Occupancy Data URLs
        WDOffStreetOccupancyURL = 'http://gis.mtc.ca.gov/mtc/rest/services/VPP/Alpha_Map/MapServer/2';
        WDOnStreetOccupancyURL = 'http://gis.mtc.ca.gov/mtc/rest/services/VPP/Alpha_Map/MapServer/3';
        WEOffStreetOccupancyURL = 'http://gis.mtc.ca.gov/mtc/rest/services/VPP/Alpha_Map/MapServer/4';
        WEOnStreetOccupancyURL = 'http://gis.mtc.ca.gov/mtc/rest/services/VPP/Alpha_Map/MapServer/5';
        FerryTerminalsURL = 'http://gis.mtc.ca.gov/mtc/rest/services/Open_Data/Open_Data_Layers/MapServer/4';
        ParknRideLotsURL = 'http://gis.mtc.ca.gov/mtc/rest/services/Open_Data/Open_Data_Layers/MapServer/5';
        RailStationsURL = 'http://gis.mtc.ca.gov/mtc/rest/services/Open_Data/Open_Data_Layers/MapServer/7';
        TransitHubsURL = 'http://gis.mtc.ca.gov/mtc/rest/services/Open_Data/Open_Data_Layers/MapServer/8';
        TPAsURL = 'http://gis.mtc.ca.gov/mtc/rest/services/Open_Data/Open_Data_Layers/MapServer/15';


        //Study Area URLs
        StudyAreaURL = 'http://gis.mtc.ca.gov/mtc/rest/services/VPP/Alpha_Map/MapServer/6'

        //QueryTasks
        StudyAreaQueryTask = new w.QueryTask(StudyAreaURL);
        //Study Area Query Result Renderer
        saq_Color = new w.Color("#007AC8");
        saq_Line = new w.SimpleLineSymbol("solid", saq_Color, 5);
        saq_Symbol = new w.SimpleFillSymbol("solid", saq_Line, null);

        saQuery = new w.Query();
        saQuery.returnGeometry = true;
        saQuery.outFields = ["*"];

        saInfoTemplate = new w.InfoTemplate("Selected Study Area", "<p><b>${Name}</b></p><p>City: ${City}</p><p>Project Title: ${Title}</p><p>Collection Year: ${CollectionYear}</p><p>Consultant: ${Consultant}</p>");


        //create a popup to replace the map's info window
        popup = new w.Popup(popupOptions, w.domConstruct.create("div"));
        parkingInspectorOnStreet = new w.InfoTemplate();
        parkingInspectorOffStreet = new w.InfoTemplate();
        parkingInspectorRestrictionsOnStreet = new w.InfoTemplate();
        parkingInspectorRestrictionsOffStreet = new w.InfoTemplate();
        parkingInspectorWDOccupancyOnStreet = new w.InfoTemplate();
        parkingInspectorWDOccupancyOffStreet = new w.InfoTemplate();
        parkingInspectorWEOccupancyOnStreet = new w.InfoTemplate();
        parkingInspectorWEOccupancyOffStreet = new w.InfoTemplate();
        parkingInspectorPeakOccupancyOnStreet = new w.InfoTemplate();
        parkingInspectorPeakOccupancyOffStreet = new w.InfoTemplate();
        transitLayerInfo = new w.InfoTemplate();

        //Start of Map Layer Configuration

        //Define Primary Basemap
        $scope.map = new w.Map('map', {
            center: [-122.416, 37.783],
            zoom: 11,
            minZoom: 3,
            maxZoom: 20,
            infoWindow: popup,
            basemap: 'topo'
        });


        $scope.map.infoWindow.set("popupWindow", false);


        //Set Map Center Variable. Used to reset map when user clicks reset map btn.
        $scope.map.on("load", function () {
            mapCenter = getCenterPoint();
        });


        //Added this code to fix HomeButton Issue
        w.registry.remove("HomeButton");
        $scope.home = new w.HomeButton({
            map: $scope.map
        }, "HomeButton");
        $scope.home.startup();

        vppGraphicsLayer = new w.GraphicsLayer({
            opacity: 0.50,
            //renderer: vppGraphicsRenderer,
            //styling: true,
            visible: true
        });

        //Define Feature Layers for Map    
        $scope.map.infoWindow.resize(400, 250);


        function initSidebar() {
            //Define all Map Layers in this section
            parkingInspector = $scope.map.infoWindow;

            //when the selection changes update the side panel to display the popup info for the 
            //currently selected feature. 
            w.connect.connect(parkingInspector, "onSelectionChange", function () {
                displayPopupContent(parkingInspector.getSelectedFeature());
                if ($("#mapInspector").is(':hidden')) {
                    clearAllTools();
                    $('#iconTitle').html("<span><i class='fa fa-question fa-lg fa-fw'></i></span>&nbsp;&nbsp;");
                    $("#title").text("Parking Inspector");
                    $("#mapToolsPNL").fadeIn(500);
                    $("#mapInspector").fadeIn(500);
                }

            });

            //when the selection is cleared remove the popup content from the side panel. 
            w.connect.connect(parkingInspector, "onClearFeatures", function () {
                $("#inspectorFeatureCount").html("Click Parking Feature to get More Information.");
                $("#parkingInfo").html("");
                $("#pager").hide();
                $("#inspectorFeatureCount").removeClass('pad-top-m');
            });

            //When features are associated with the  map's info window update the sidebar with the new content. 
            w.connect.connect(parkingInspector, "onSetFeatures", function () {
                displayPopupContent(parkingInspector.getSelectedFeature());
                $("#inspectorFeatureCount").html(parkingInspector.features.length + " feature(s) selected.");
                $("#inspectorFeatureCount").addClass('pad-top-m');
                //enable navigation if more than one feature is selected 
                parkingInspector.features.length > 1 ? $("#pager").show() : $("#pager").hide();
            });
        }

        function displayPopupContent(feature) {
            switch ($scope.pt) {
            case "inventory":
                parkingInspectorOnStreet.setContent("<p><b>On-Street Parking Inventory </b></p><p><b>Street Name</b>: ${Street_Name}</p><p><b>From Street</b>: ${From_Street}</p><p><b>To Street</b>: ${To_Street}</p><p>There are <b>${Total_Spaces:NumberFormat}</b> total parking spaces on this block.</p>");
                parkingInspectorOffStreet.setContent("<p><b>Off-Street Parking Inventory</b></p><p><b>Facility Name</b>: ${Facility_Name}</p><p>There are <b>${Total_Spaces:NumberFormat}</b> total parking spaces in this facility.</p>");
                break;
            case "restrictions":
                parkingInspectorRestrictionsOnStreet.setContent("<p><b>On-Street Parking Restrictions </b></p><p><b>Street Name</b>: ${Street_Name}</p><p><b>From Street</b>: ${From_Street}</p><p><b>To Street</b>: ${To_Street}</p><p>This block has the following parking restrictions:</p><p><b>${Restrictions}</b></p>");
                parkingInspectorRestrictionsOffStreet.setContent("<p><b>Off-Street Parking Restrictions</b></p><p><b>Facility Name</b>: ${Facility_Name}</p><p>This facility has the following parking restrictions:</p><p><b>${Restrictions}</b></p>");
                break;
            case "wkdayOCC":
                parkingInspectorWDOccupancyOffStreet.setContent("<p><b>Off-Street Weekday Occupancy </b></p><p><b>Facility Name</b>: ${Facility_Name}</p><p>There are <b>${Total_Spaces:NumberFormat}</b> total parking spaces in this facility.</p><p><table class='table table-striped'><thead><th>Time Period</th><th>Occupied Spaces</th></thead><tbody><tr><td>Occupancy 5 AM:</td><td class='text-center'>${Total_5_00}</td></tr><tr><td>Occupancy 9 AM:</td><td class='text-center'>${Total_9_00}</td></tr><tr><td>Occupancy 12 PM:</td><td class='text-center'>${Total_12_00}</td></tr><tr><td>Occupancy 4 PM:</td><td class='text-center'>${Total_16_00}</td></tr><tr><td>Occupancy 8 PM:</td><td class='text-center'>${Total_20_00}</td></tr></tbody></table></p>");
                parkingInspectorWDOccupancyOnStreet.setContent("<p><b>On-Street Weekday Occupancy </b></p><p><b>Street Name</b>: ${Street_Name}</p><p><b>From Street</b>: ${From_Street}</p><p><b>To Street</b>: ${To_Street}</p><p>There are <b>${Total_Spaces:NumberFormat}</b> total parking spaces on this block</p><table class='table table-striped'><thead><th>Time Period</th><th>Occupied Spaces</th></thead><tbody><tr><td>Occupancy 5 AM:</td><td class='text-center'>${Total_5_00}</td></tr><tr><td>Occupancy 9 AM:</td><td class='text-center'>${Total_9_00}</td></tr><tr><td>Occupancy 12 PM:</td><td class='text-center'>${Total_12_00}</td></tr><tr><td>Occupancy 4 PM:</td><td class='text-center'>${Total_16_00}</td></tr><tr><td>Occupancy 8 PM:</td><td class='text-center'>${Total_20_00}</td></tr></tbody></table>");
                break;
            case "wkndOCC":
                parkingInspectorWEOccupancyOffStreet.setContent("<p><b>Off-Street Weekend Occupancy </b></p><p><b>Facility Name</b>: ${Facility_Name}</p><p>There are <b>${Total_Spaces:NumberFormat}</b> total parking spaces in this facility.</p><p><table class='table table-striped'><thead><th>Time Period</th><th>Occupied Spaces</th></thead><tbody><tr><td>Occupancy 5 AM:</td><td class='text-center'>${Total_5_00}</td></tr><tr><td>Occupancy 9 AM:</td><td class='text-center'>${Total_9_00}</td></tr><tr><td>Occupancy 12 PM:</td><td class='text-center'>${Total_12_00}</td></tr><tr><td>Occupancy 4 PM:</td><td class='text-center'>${Total_16_00}</td></tr><tr><td>Occupancy 8 PM:</td><td class='text-center'>${Total_20_00}</td></tr></tbody></table></p>");
                parkingInspectorWEOccupancyOnStreet.setContent("<p><b>On-Street Weekend Occupancy </b></p><p><b>Street Name</b>: ${Street_Name}</p><p><b>From Street</b>: ${From_Street}</p><p><b>To Street</b>: ${To_Street}</p><p>There are <b>${Total_Spaces:NumberFormat}</b> total parking spaces on this block</p><table class='table table-striped'><thead><th>Time Period</th><th>Occupied Spaces</th></thead><tbody><tr><td>Occupancy 5 AM:</td><td class='text-center'>${Total_5_00}</td></tr><tr><td>Occupancy 9 AM:</td><td class='text-center'>${Total_9_00}</td></tr><tr><td>Occupancy 12 PM:</td><td class='text-center'>${Total_12_00}</td></tr><tr><td>Occupancy 4 PM:</td><td class='text-center'>${Total_16_00}</td></tr><tr><td>Occupancy 8 PM:</td><td class='text-center'>${Total_20_00}</td></tr></tbody></table>");


                break;
            case "peakOCC":
                parkingInspectorPeakOccupancyOffStreet.setContent("<p><b>Off-Street Weekend Occupancy </b></p><p><b>Facility Name</b>: ${Facility_Name}</p><p>There are <b>${Total_Spaces:NumberFormat}</b> total parking spaces in this facility.</p><p><table class='table table-striped'><thead><th>Time Period</th><th>Occupied Spaces</th></thead><tbody><tr><td>Occupancy 5 AM:</td><td class='text-center'>${Total_5_00}</td></tr><tr><td>Occupancy 9 AM:</td><td class='text-center'>${Total_9_00}</td></tr><tr><td>Occupancy 12 PM:</td><td class='text-center'>${Total_12_00}</td></tr><tr><td>Occupancy 4 PM:</td><td class='text-center'>${Total_16_00}</td></tr><tr><td>Occupancy 8 PM:</td><td class='text-center'>${Total_20_00}</td></tr></tbody></table></p>");
                parkingInspectorPeakOccupancyOnStreet.setContent("<p><b>On-Street Weekend Occupancy </b></p><p><b>Street Name</b>: ${Street_Name}</p><p><b>From Street</b>: ${From_Street}</p><p><b>To Street</b>: ${To_Street}</p><p>There are <b>${Total_Spaces:NumberFormat}</b> total parking spaces on this block</p><table class='table table-striped'><thead><th>Time Period</th><th>Occupied Spaces</th></thead><tbody><tr><td>Occupancy 5 AM:</td><td class='text-center'>${Total_5_00}</td></tr><tr><td>Occupancy 9 AM:</td><td class='text-center'>${Total_9_00}</td></tr><tr><td>Occupancy 12 PM:</td><td class='text-center'>${Total_12_00}</td></tr><tr><td>Occupancy 4 PM:</td><td class='text-center'>${Total_16_00}</td></tr><tr><td>Occupancy 8 PM:</td><td class='text-center'>${Total_20_00}</td></tr></tbody></table>");

                break;

            }

            if (feature) {
                var content = feature.getContent();
                $("#parkingInfo").html(content);
            }
        }

        $("#previous").on("click", selectPrevious);
        $("#next").on("click", selectNext);

        function selectPrevious() {
            parkingInspector.selectPrevious();
            displayPopupContent(parkingInspector.getSelectedFeature());
        }

        function selectNext() {
            parkingInspector.selectNext();
            displayPopupContent(parkingInspector.getSelectedFeature());
        }

        //initializes Inventory SideBar Content
        initSidebar();



        OnStreetInventoryFL = new w.FeatureLayer(OnStreetInventoryURL, {
            id: "OnStreetInventory",
            mode: w.FeatureLayer.MODE_SNAPSHOT,
            outFields: ["*"],
            visible: false,
            //infoTemplate: popupTemplate_OnStreetInventoryFL
            infoTemplate: parkingInspectorOnStreet

        });

        OffStreetInventoryFL = new w.FeatureLayer(OffStreetInventoryURL, {
            id: "OffStreetInventory",
            mode: w.FeatureLayer.MODE_SNAPSHOT,
            outFields: ["*"],
            visible: false,
            //infoTemplate: popupTemplate_OffStreetInventoryFL
            infoTemplate: parkingInspectorOffStreet
        });

        OnStreetRestrictionsFL = new w.FeatureLayer(OnStreetInventoryURL, {
            id: "OnStreetRestrictions",
            mode: w.FeatureLayer.MODE_SNAPSHOT,
            outFields: ["*"],
            visible: false,
            //infoTemplate: popupTemplate_OnStreetRestrictionsFL
            infoTemplate: parkingInspectorRestrictionsOnStreet
        });

        OffStreetRestrictionsFL = new w.FeatureLayer(OffStreetInventoryURL, {
            id: "OffStreetRestrictions",
            mode: w.FeatureLayer.MODE_SNAPSHOT,
            outFields: ["*"],
            visible: false,
            infoTemplate: parkingInspectorRestrictionsOffStreet
        });

        WDOffStreetOccupancyFL = new w.FeatureLayer(WDOffStreetOccupancyURL, {
            id: "WDOffStreetOccupancy",
            mode: w.FeatureLayer.MODE_SNAPSHOT,
            outFields: ["*"],
            visible: false,
            //infoTemplate: popupTemplate_WDOffStreetOccupancyFL
            infoTemplate: parkingInspectorWDOccupancyOffStreet
        });

        WDOnStreetOccupancyFL = new w.FeatureLayer(WDOnStreetOccupancyURL, {
            id: "WDOnStreetOccupancy",
            mode: w.FeatureLayer.MODE_SNAPSHOT,
            outFields: ["*"],
            visible: false,
            //infoTemplate: popupTemplate_WDOnStreetOccupancyFL
            infoTemplate: parkingInspectorWDOccupancyOnStreet
        });

        WEOffStreetOccupancyFL = new w.FeatureLayer(WEOffStreetOccupancyURL, {
            id: "WEOffStreetOccupancy",
            mode: w.FeatureLayer.MODE_SNAPSHOT,
            outFields: ["*"],
            visible: false,
            //infoTemplate: popupTemplate_WEOffStreetOccupancyFL
            infoTemplate: parkingInspectorWEOccupancyOffStreet
        });

        WEOnStreetOccupancyFL = new w.FeatureLayer(WEOnStreetOccupancyURL, {
            id: "WEOnStreetOccupancy",
            mode: w.FeatureLayer.MODE_SNAPSHOT,
            outFields: ["*"],
            visible: false,
            //infoTemplate: popupTemplate_WEOnStreetOccupancyFL
            infoTemplate: parkingInspectorWEOccupancyOnStreet

        });
        PeakOffStreetOccupancyFL = new w.FeatureLayer(WEOffStreetOccupancyURL, {
            id: "PeakOffStreetOccupancy",
            mode: w.FeatureLayer.MODE_SNAPSHOT,
            outFields: ["*"],
            visible: false,
            //infoTemplate: popupTemplate_WEOffStreetOccupancyFL
            infoTemplate: parkingInspectorPeakOccupancyOffStreet
        });

        PeakOnStreetOccupancyFL = new w.FeatureLayer(WEOnStreetOccupancyURL, {
            id: "PeakOnStreetOccupancy",
            mode: w.FeatureLayer.MODE_SNAPSHOT,
            outFields: ["*"],
            visible: false,
            //infoTemplate: popupTemplate_WEOnStreetOccupancyFL
            infoTemplate: parkingInspectorPeakOccupancyOnStreet

        });

        studyAreasFL = new w.FeatureLayer("http://gis.mtc.ca.gov/mtc/rest/services/VPP/Alpha_Map/MapServer/6", {
            id: "studyAreas",
            mode: w.FeatureLayer.MODE_SNAPSHOT,
            outFields: ["*"],
            visible: true

        });

        saLabelsFL = new w.ArcGISDynamicMapServiceLayer("http://gis.mtc.ca.gov/mtc/rest/services/VPP/Alpha_Map/MapServer");

        saLabelsFL.setVisibleLayers([7]);
        saLabelsFL.setImageFormat("PNG32");






        PDA_FL = new w.FeatureLayer("http://gis.mtc.ca.gov/mtc/rest/services/OBAG_PDA/OBAG_PDA/MapServer/0", {
            id: "PDA",
            mode: w.FeatureLayer.MODE_SNAPSHOT,
            outFields: ["*"],
            visible: false

        });


        FerryTerminalsFL = new w.FeatureLayer(FerryTerminalsURL, {
            id: "FerryTerminals",
            mode: w.FeatureLayer.MODE_SNAPSHOT,
            outFields: ["*"],
            visible: false,
            infoTemplate: transitLayerInfo

        });

        ParknRideLotsFL = new w.FeatureLayer(ParknRideLotsURL, {
            id: "ParknRideLots",
            mode: w.FeatureLayer.MODE_SNAPSHOT,
            outFields: ["*"],
            visible: false,
            infoTemplate: transitLayerInfo

        });

        /*RailStationsFL = new w.FeatureLayer(RailStationsURL, {
            id: "RailStations",
            mode: w.FeatureLayer.MODE_SNAPSHOT,
            outFields: ["*"],
            visible: false

        });*/
        BartFL = new w.FeatureLayer(RailStationsURL, {
            id: "Bart",
            mode: w.FeatureLayer.MODE_SNAPSHOT,
            outFields: ["*"],
            visible: true,
            infoTemplate: transitLayerInfo
        });
        BartFL.setDefinitionExpression("agencyname='BART'");

        CaltrainFL = new w.FeatureLayer(RailStationsURL, {
            id: "Caltrain",
            mode: w.FeatureLayer.MODE_SNAPSHOT,
            outFields: ["*"],
            visible: true,
            infoTemplate: transitLayerInfo
        });
        CaltrainFL.setDefinitionExpression("agencyname='CALTRAIN'");

        AmtrakFL = new w.FeatureLayer(RailStationsURL, {
            id: "Amtrak",
            mode: w.FeatureLayer.MODE_SNAPSHOT,
            outFields: ["*"],
            visible: false,
            infoTemplate: transitLayerInfo
        });
        AmtrakFL.setDefinitionExpression("agencyname='Amtrak Capitol Cor. & Reg. Svc'");

        LightRailFL = new w.FeatureLayer(RailStationsURL, {
            id: "LightRail",
            mode: w.FeatureLayer.MODE_SNAPSHOT,
            outFields: ["*"],
            visible: false,
            infoTemplate: transitLayerInfo

        });

        LightRailFL.setDefinitionExpression("agencyname<>'BART' AND agencyname<>'CALTRAIN' AND agencyname<>'Amtrak Capitol Cor. & Reg. Svc'");

        TransitHubsFL = new w.FeatureLayer(TransitHubsURL, {
            id: "TransitHubs",
            mode: w.FeatureLayer.MODE_SNAPSHOT,
            outFields: ["*"],
            visible: false,
            infoTemplate: transitLayerInfo

        });

        TPAsFL = new w.FeatureLayer(TPAsURL, {
            id: "TPAsFL",
            mode: w.FeatureLayer.MODE_SNAPSHOT,
            outFields: ["*"],
            visible: false

        });


        //end of map layer definitions


        //Set Map Renderers Section


        //Set Map Renderers for OnStreetInventoryFL
        symbol = new w.SimpleLineSymbol(w.SimpleLineSymbol.STYLE_SOLID,
            new w.Color([255, 0, 0]));
        var renderer = new w.ClassBreaksRenderer(symbol, "Total_Spaces");


        var Break0Color = new w.Color([120, 120, 120, 1]);
        var Break0LineSymbol = new w.SimpleLineSymbol("solid", Break0Color, 2);

        var Break1Color = new w.Color([166, 97, 26, 1]);
        var Break1LineSymbol = new w.SimpleLineSymbol("solid", Break1Color, 2);

        var Break2Color = new w.Color([223, 194, 125, 1]);
        var Break2LineSymbol = new w.SimpleLineSymbol("solid", Break2Color, 2);

        var Break3Color = new w.Color([230, 97, 1, 1]);
        var Break3LineSymbol = new w.SimpleLineSymbol("solid", Break3Color, 2);

        var Break4Color = new w.Color([128, 205, 193, 1]);
        var Break4LineSymbol = new w.SimpleLineSymbol("solid", Break4Color, 2);

        var Break5Color = new w.Color([1, 133, 113, 1]);
        var Break5LineSymbol = new w.SimpleLineSymbol("solid", Break5Color, 2);


        var Break0_minValue = 0;
        var Break0_maxValue = 0;

        var Break1_minValue = 1;
        var Break1_maxValue = 4;

        var Break2_minValue = 5;
        var Break2_maxValue = 15;

        var Break3_minValue = 16;
        var Break3_maxValue = 25;

        var Break4_minValue = 26;
        var Break4_maxValue = 50;

        var Break5_minValue = 51;
        var Break5_maxValue = 10000;

        renderer.addBreak(Break0_minValue, Break0_maxValue, Break0LineSymbol);
        renderer.addBreak(Break1_minValue, Break1_maxValue, Break1LineSymbol);
        renderer.addBreak(Break2_minValue, Break2_maxValue, Break2LineSymbol);
        renderer.addBreak(Break3_minValue, Break3_maxValue, Break3LineSymbol);
        renderer.addBreak(Break4_minValue, Break4_maxValue, Break4LineSymbol);
        renderer.addBreak(Break5_minValue, Break5_maxValue, Break5LineSymbol);

        OnStreetInventoryFL.setRenderer(renderer);

        //Set Map Renderers for OffStreetInventoryFL
        var OffStreetInventorySymbol = new w.SimpleFillSymbol().setStyle(w.SimpleFillSymbol.STYLE_NULL);
        OffStreetInventorySymbol.outline.setStyle(w.SimpleLineSymbol.STYLE_NULL);

        //create renderer
        var OffStreetInventoryRenderer = new w.ClassBreaksRenderer(OffStreetInventorySymbol, "Total_Spaces");


        var Break1Symbol_OffStreetInventory = new w.SimpleFillSymbol(w.SimpleFillSymbol.STYLE_SOLID, new w.SimpleLineSymbol("solid", new w.Color([110, 110, 110, 1]), 2), new w.Color([166, 97, 26, 0.5]));
        var Break2Symbol_OffStreetInventory = new w.SimpleFillSymbol(w.SimpleFillSymbol.STYLE_SOLID, new w.SimpleLineSymbol("solid", new w.Color([110, 110, 110, 1]), 2), new w.Color([223, 194, 125, 0.5]));
        var Break3Symbol_OffStreetInventory = new w.SimpleFillSymbol(w.SimpleFillSymbol.STYLE_SOLID, new w.SimpleLineSymbol("solid", new w.Color([110, 110, 110, 1]), 2), new w.Color([230, 97, 1, 0.5]));
        var Break4Symbol_OffStreetInventory = new w.SimpleFillSymbol(w.SimpleFillSymbol.STYLE_SOLID, new w.SimpleLineSymbol("solid", new w.Color([110, 110, 110, 1]), 2), new w.Color([128, 205, 193, 0.5]));
        var Break5Symbol_OffStreetInventory = new w.SimpleFillSymbol(w.SimpleFillSymbol.STYLE_SOLID, new w.SimpleLineSymbol("solid", new w.Color([110, 110, 110, 1]), 2), new w.Color([1, 133, 113, 0.5]));

        var Break1_minValue_OffStreetInventory = 0;
        var Break1_maxValue_OffStreetInventory = 4;

        var Break2_minValue_OffStreetInventory = 5;
        var Break2_maxValue_OffStreetInventory = 15;

        var Break3_minValue_OffStreetInventory = 16;
        var Break3_maxValue_OffStreetInventory = 25;

        var Break4_minValue_OffStreetInventory = 26;
        var Break4_maxValue_OffStreetInventory = 50;

        var Break5_minValue_OffStreetInventory = 51;
        var Break5_maxValue_OffStreetInventory = 10000;

        OffStreetInventoryRenderer.addBreak(Break1_minValue_OffStreetInventory, Break1_maxValue_OffStreetInventory, Break1Symbol_OffStreetInventory);
        OffStreetInventoryRenderer.addBreak(Break2_minValue_OffStreetInventory, Break2_maxValue_OffStreetInventory, Break2Symbol_OffStreetInventory);
        OffStreetInventoryRenderer.addBreak(Break3_minValue_OffStreetInventory, Break3_maxValue_OffStreetInventory, Break3Symbol_OffStreetInventory);
        OffStreetInventoryRenderer.addBreak(Break4_minValue_OffStreetInventory, Break4_maxValue_OffStreetInventory, Break4Symbol_OffStreetInventory);
        OffStreetInventoryRenderer.addBreak(Break5_minValue_OffStreetInventory, Break5_maxValue_OffStreetInventory, Break5Symbol_OffStreetInventory);

        OffStreetInventoryFL.setRenderer(OffStreetInventoryRenderer);

        //Unique Value Renderer for OffStreetRestrictionsFL
        var UniqueValueRendererSymbol = new w.SimpleFillSymbol().setStyle(w.SimpleFillSymbol.STYLE_NULL);
        UniqueValueRendererSymbol.outline.setStyle(w.SimpleLineSymbol.STYLE_NULL);

        //create renderer
        var OffStreetRestrictionsRenderer = new w.UniqueValueRenderer(UniqueValueRendererSymbol, "Restrictions");

        //add symbol for each possible value
        OffStreetRestrictionsRenderer.addValue("No Restrictions", new w.SimpleFillSymbol(w.SimpleFillSymbol.STYLE_SOLID, new w.SimpleLineSymbol("solid", new w.Color([110, 110, 110, 1]), 2), new w.Color([204, 204, 204, 0.5])));
        OffStreetRestrictionsRenderer.addValue("Pricing Regulations", new w.SimpleFillSymbol(w.SimpleFillSymbol.STYLE_SOLID, new w.SimpleLineSymbol("solid", new w.Color([110, 110, 110, 1]), 2), new w.Color([0, 77, 168, 0.5])));
        OffStreetRestrictionsRenderer.addValue("Time Restricted", new w.SimpleFillSymbol(w.SimpleFillSymbol.STYLE_SOLID, new w.SimpleLineSymbol("solid", new w.Color([110, 110, 110, 1]), 2), new w.Color([115, 178, 255, 0.5])));


        OffStreetRestrictionsFL.setRenderer(OffStreetRestrictionsRenderer);

        //Unique Value Renderer for OnStreetRestrictionsFL
        var UniqueValueRendererLineSymbol = new w.SimpleLineSymbol(w.SimpleLineSymbol.STYLE_SOLID,
            new w.Color([255, 0, 0]));
        //create renderer
        var OnStreetRestrictionsRenderer = new w.UniqueValueRenderer(UniqueValueRendererLineSymbol, "Restrictions");

        //add symbol for each possible value
        OnStreetRestrictionsRenderer.addValue("No Parking", new w.SimpleLineSymbol("solid", new w.Color([78, 78, 78, 1]), 2));
        OnStreetRestrictionsRenderer.addValue("No Restrictions", new w.SimpleLineSymbol("solid", new w.Color([204, 204, 204, 1]), 2));
        OnStreetRestrictionsRenderer.addValue("Pricing Restrictions", new w.SimpleLineSymbol("solid", new w.Color([0, 92, 230, 1]), 2));
        OnStreetRestrictionsRenderer.addValue("Time Restrictions", new w.SimpleLineSymbol("solid", new w.Color([115, 178, 255, 1]), 2));

        OnStreetRestrictionsRenderer.addValue("Time and Pricing Restrictions", new w.SimpleLineSymbol("solid", new w.Color([138, 43, 226, 1]), 2));
        OnStreetRestrictionsRenderer.addValue("Accessible/Loading/Other", new w.SimpleLineSymbol("solid", new w.Color([0, 128, 0, 1]), 2));
        OnStreetRestrictionsRenderer.addValue("Unknown/Error", new w.SimpleLineSymbol("solid", new w.Color([139, 69, 19, 1]), 2));


        OnStreetRestrictionsFL.setRenderer(OnStreetRestrictionsRenderer);



        //Set Map Renderers for WDOnStreetOccupancyFL and WEOnStreetOccupancyFL
        symbol_OnStreetOccupancy = new w.SimpleLineSymbol(w.SimpleLineSymbol.STYLE_SOLID,
            new w.Color([255, 0, 0]));


        var Break1Color_OnStreetOccupancy = new w.Color([56, 168, 0, 1]);
        var Break1LineSymbol_OnStreetOccupancy = new w.SimpleLineSymbol("solid", Break1Color_OnStreetOccupancy, 2);

        var Break2Color_OnStreetOccupancy = new w.Color([139, 209, 0, 1]);
        var Break2LineSymbol_OnStreetOccupancy = new w.SimpleLineSymbol("solid", Break2Color_OnStreetOccupancy, 2);

        var Break3Color_OnStreetOccupancy = new w.Color([255, 255, 0, 1]);
        var Break3LineSymbol_OnStreetOccupancy = new w.SimpleLineSymbol("solid", Break3Color_OnStreetOccupancy, 2);

        var Break4Color_OnStreetOccupancy = new w.Color([255, 128, 0, 1]);
        var Break4LineSymbol_OnStreetOccupancy = new w.SimpleLineSymbol("solid", Break4Color_OnStreetOccupancy, 2);

        var Break5Color_OnStreetOccupancy = new w.Color([255, 0, 0, 1]);
        var Break5LineSymbol_OnStreetOccupancy = new w.SimpleLineSymbol("solid", Break5Color_OnStreetOccupancy, 2);

        var Break1_minValue_OnStreetOccupancy = 0;
        var Break1_maxValue_OnStreetOccupancy = 0.50;

        var Break2_minValue_OnStreetOccupancy = 0.51;
        var Break2_maxValue_OnStreetOccupancy = 0.75;

        var Break3_minValue_OnStreetOccupancy = 0.76;
        var Break3_maxValue_OnStreetOccupancy = 0.85;

        var Break4_minValue_OnStreetOccupancy = 0.86;
        var Break4_maxValue_OnStreetOccupancy = 0.95;

        var Break5_minValue_OnStreetOccupancy = 0.96;
        var Break5_maxValue_OnStreetOccupancy = 100;


        //Set Map Renderers for WDOffStreetOccupancyFL and WEOffStreetOccupancyFL
        /*var OffStreetOccupancySymbol = new w.SimpleFillSymbol().setStyle(w.SimpleFillSymbol.STYLE_NULL);
        OffStreetOccupancySymbol.outline.setStyle(w.SimpleLineSymbol.STYLE_NULL);*/

        var OffStreetOccupancySymbol = new w.SimpleFillSymbol(w.SimpleFillSymbol.STYLE_SOLID, new w.SimpleLineSymbol("solid", new w.Color([110, 110, 110, 1]), 2), new w.Color([110, 110, 110, 0.5]));

        //create renderer
        //var OffStreetOccupancyRenderer = new w.ClassBreaksRenderer(OffStreetOccupancySymbol, "Occupancy_5am");

        var Break1Symbol_OffStreetOccupancy = new w.SimpleFillSymbol(w.SimpleFillSymbol.STYLE_SOLID, new w.SimpleLineSymbol("solid", new w.Color([110, 110, 110, 1]), 2), new w.Color([56, 168, 0, 0.5]));
        var Break2Symbol_OffStreetOccupancy = new w.SimpleFillSymbol(w.SimpleFillSymbol.STYLE_SOLID, new w.SimpleLineSymbol("solid", new w.Color([110, 110, 110, 1]), 2), new w.Color([139, 209, 0, 0.5]));
        var Break3Symbol_OffStreetOccupancy = new w.SimpleFillSymbol(w.SimpleFillSymbol.STYLE_SOLID, new w.SimpleLineSymbol("solid", new w.Color([110, 110, 110, 1]), 2), new w.Color([255, 255, 0, 0.5]));
        var Break4Symbol_OffStreetOccupancy = new w.SimpleFillSymbol(w.SimpleFillSymbol.STYLE_SOLID, new w.SimpleLineSymbol("solid", new w.Color([110, 110, 110, 1]), 2), new w.Color([255, 128, 0, 0.5]));
        var Break5Symbol_OffStreetOccupancy = new w.SimpleFillSymbol(w.SimpleFillSymbol.STYLE_SOLID, new w.SimpleLineSymbol("solid", new w.Color([110, 110, 110, 1]), 2), new w.Color([255, 0, 0, 0.5]));

        var Break0_minValue_OffStreetOccupancy = undefined;
        var Break0_maxValue_OffStreetOccupancy = undefined;

        var Break1_minValue_OffStreetOccupancy = 0;
        var Break1_maxValue_OffStreetOccupancy = 0.5;

        var Break2_minValue_OffStreetOccupancy = 0.51;
        var Break2_maxValue_OffStreetOccupancy = 0.75;

        var Break3_minValue_OffStreetOccupancy = 0.76;
        var Break3_maxValue_OffStreetOccupancy = 0.85;

        var Break4_minValue_OffStreetOccupancy = 0.86;
        var Break4_maxValue_OffStreetOccupancy = 0.95;

        var Break5_minValue_OffStreetOccupancy = 0.96;
        var Break5_maxValue_OffStreetOccupancy = 100;

        /*OffStreetOccupancyRenderer.addBreak(Break0_minValue_OffStreetOccupancy, Break0_maxValue_OffStreetOccupancy);
        OffStreetOccupancyRenderer.addBreak(Break1_minValue_OffStreetOccupancy, Break1_maxValue_OffStreetOccupancy, Break1Symbol_OffStreetOccupancy);
        OffStreetOccupancyRenderer.addBreak(Break2_minValue_OffStreetOccupancy, Break2_maxValue_OffStreetOccupancy, Break2Symbol_OffStreetOccupancy);
        OffStreetOccupancyRenderer.addBreak(Break3_minValue_OffStreetOccupancy, Break3_maxValue_OffStreetOccupancy, Break3Symbol_OffStreetOccupancy);
        OffStreetOccupancyRenderer.addBreak(Break4_minValue_OffStreetOccupancy, Break4_maxValue_OffStreetOccupancy, Break4Symbol_OffStreetOccupancy);
        OffStreetOccupancyRenderer.addBreak(Break5_minValue_OffStreetOccupancy, Break5_maxValue_OffStreetOccupancy, Break5Symbol_OffStreetOccupancy);

        WDOffStreetOccupancyFL.setRenderer(OffStreetOccupancyRenderer);
        WEOffStreetOccupancyFL.setRenderer(OffStreetOccupancyRenderer);
        PeakOffStreetOccupancyFL.setRenderer(OffStreetOccupancyRenderer);

        PeakOffStreetOccupancyFL.refresh();
        WEOffStreetOccupancyFL.refresh();
        WDOffStreetOccupancyFL.refresh();
*/

        //Begin Function Here...
        function SetOccupancyRenderer(occ) {
                //console.clear();
                $scope.OCCtimeperiod = occ;
                //console.log($scope.OCCtimeperiod);

                $scope.renderer_OnStreetOccupancy = new w.ClassBreaksRenderer(symbol_OnStreetOccupancy, $scope.OCCtimeperiod);
                $scope.renderer_OnStreetOccupancy.clearBreaks();
                $scope.renderer_OnStreetOccupancy.addBreak(Break1_minValue_OnStreetOccupancy, Break1_maxValue_OnStreetOccupancy, Break1LineSymbol_OnStreetOccupancy);
                $scope.renderer_OnStreetOccupancy.addBreak(Break2_minValue_OnStreetOccupancy, Break2_maxValue_OnStreetOccupancy, Break2LineSymbol_OnStreetOccupancy);
                $scope.renderer_OnStreetOccupancy.addBreak(Break3_minValue_OnStreetOccupancy, Break3_maxValue_OnStreetOccupancy, Break3LineSymbol_OnStreetOccupancy);
                $scope.renderer_OnStreetOccupancy.addBreak(Break4_minValue_OnStreetOccupancy, Break4_maxValue_OnStreetOccupancy, Break4LineSymbol_OnStreetOccupancy);
                $scope.renderer_OnStreetOccupancy.addBreak(Break5_minValue_OnStreetOccupancy, Break5_maxValue_OnStreetOccupancy, Break5LineSymbol_OnStreetOccupancy);
                WDOnStreetOccupancyFL.setRenderer($scope.renderer_OnStreetOccupancy);
                WEOnStreetOccupancyFL.setRenderer($scope.renderer_OnStreetOccupancy);
                PeakOnStreetOccupancyFL.setRenderer($scope.renderer_OnStreetOccupancy);

                WDOnStreetOccupancyFL.refresh();
                PeakOnStreetOccupancyFL.refresh();
                WEOnStreetOccupancyFL.refresh();





                $scope.OffStreetOccupancyRenderer = new w.ClassBreaksRenderer(OffStreetOccupancySymbol, $scope.OCCtimeperiod);
                $scope.OffStreetOccupancyRenderer.clearBreaks();
                $scope.OffStreetOccupancyRenderer.addBreak(Break0_minValue_OffStreetOccupancy, Break0_maxValue_OffStreetOccupancy);
                $scope.OffStreetOccupancyRenderer.addBreak(Break1_minValue_OffStreetOccupancy, Break1_maxValue_OffStreetOccupancy, Break1Symbol_OffStreetOccupancy);
                $scope.OffStreetOccupancyRenderer.addBreak(Break2_minValue_OffStreetOccupancy, Break2_maxValue_OffStreetOccupancy, Break2Symbol_OffStreetOccupancy);
                $scope.OffStreetOccupancyRenderer.addBreak(Break3_minValue_OffStreetOccupancy, Break3_maxValue_OffStreetOccupancy, Break3Symbol_OffStreetOccupancy);
                $scope.OffStreetOccupancyRenderer.addBreak(Break4_minValue_OffStreetOccupancy, Break4_maxValue_OffStreetOccupancy, Break4Symbol_OffStreetOccupancy);
                $scope.OffStreetOccupancyRenderer.addBreak(Break5_minValue_OffStreetOccupancy, Break5_maxValue_OffStreetOccupancy, Break5Symbol_OffStreetOccupancy);
                WDOffStreetOccupancyFL.setRenderer($scope.OffStreetOccupancyRenderer);
                WEOffStreetOccupancyFL.setRenderer($scope.OffStreetOccupancyRenderer);
                PeakOffStreetOccupancyFL.setRenderer($scope.OffStreetOccupancyRenderer);

                WDOffStreetOccupancyFL.refresh();
                PeakOffStreetOccupancyFL.refresh();
                WEOffStreetOccupancyFL.refresh();



            }
            //Setting up Simple Lines Renderer for Study Areas
        studyAreasColor = new w.Color("#007AC8");
        studyAreasLine = new w.SimpleLineSymbol("solid", studyAreasColor, 2);
        studyAreasSymbol = new w.SimpleFillSymbol(w.SimpleFillSymbol.STYLE_SOLID, studyAreasLine, new w.Color([255, 255, 255, 1]));
        studyAreasRenderer = new w.SimpleRenderer(studyAreasSymbol);

        //set up scale dependant renderer for studyAreasLine symbol
        //Use this example but only for lines:
        //https://developers.arcgis.com/javascript/jssamples/renderer_proportional_scale_dependent.html

        studyAreasFL.setRenderer(studyAreasRenderer);
        studyAreasFL.setOpacity(studyAreasFLop);


        //Setting up Point Renderer for FerryTerminalsFL

        var FerryTerminals_markerSymbol = new w.PictureMarkerSymbol({
            "url": "app/images/ferry.png",
            "height": 15,
            "width": 15
        });


        var FerryTerminals_Renderer = new w.SimpleRenderer(FerryTerminals_markerSymbol);

        FerryTerminalsFL.setRenderer(FerryTerminals_Renderer);

        //Setting up Point Renderer for ParknRideLotsFL


        var ParknRideLots_markerSymbol = new w.PictureMarkerSymbol({
            "url": "app/images/parkandride.png",
            "height": 15,
            "width": 15
        });


        var ParknRideLots_Renderer = new w.SimpleRenderer(ParknRideLots_markerSymbol);
        ParknRideLotsFL.setRenderer(ParknRideLots_Renderer);


        //Setting up Point Renderer for RailStationsFL

        var RailStations_markerSymbol = new w.PictureMarkerSymbol({
            "url": "app/images/train_beige.png",
            "height": 15,
            "width": 15
        });


        var LightRail_Renderer = new w.SimpleRenderer(RailStations_markerSymbol);
        LightRailFL.setRenderer(LightRail_Renderer);



        //Setting up Point Renderer for BartFL
        var Bart_markerSymbol = new w.PictureMarkerSymbol({
            "url": "app/images/bart.png",
            "height": 15,
            "width": 15
        });

        var bart_Renderer = new w.SimpleRenderer(Bart_markerSymbol);
        BartFL.setRenderer(bart_Renderer);

        //Setting up Point Renderer for CaltrainFL
        var caltrain_markerSymbol = new w.PictureMarkerSymbol({
            "url": "app/images/caltrain_logo_web.png",
            "height": 22,
            "width": 40
        });

        var caltrain_Renderer = new w.SimpleRenderer(caltrain_markerSymbol);
        CaltrainFL.setRenderer(caltrain_Renderer);

        //Setting up Point Renderer for AmtrakFL
        var amtrak_markerSymbol = new w.PictureMarkerSymbol({
            "url": "app/images/amtrak.png",
            "height": 13,
            "width": 35
        });

        var amtrak_Renderer = new w.SimpleRenderer(amtrak_markerSymbol);
        AmtrakFL.setRenderer(amtrak_Renderer);




        //Setting up Point Renderer for TransitHubsFL

        var TransitHubs_markerSymbol = new w.PictureMarkerSymbol({
            "url": "app/images/bus.png",
            "height": 15,
            "width": 15
        });

        var TransitHubs_Renderer = new w.SimpleRenderer(TransitHubs_markerSymbol);
        TransitHubsFL.setRenderer(TransitHubs_Renderer);

        //Setting up Simple Lines Renderer for TPAsFL
        var TPAs_Color = new w.Color([242, 167, 52, 0.3]);
        var TPAs_Line = new w.SimpleLineSymbol("solid", TPAs_Color, 2);
        var TPAs_Symbol = new w.SimpleFillSymbol(w.SimpleFillSymbol.STYLE_SOLID, TPAs_Line, new w.Color([242, 167, 52, 1]));
        var TPAs_Renderer = new w.SimpleRenderer(TPAs_Symbol);

        TPAsFL.setRenderer(TPAs_Renderer);
        TPAsFL.setOpacity(TPAsFLop);


        //PDA Popup and Feature Layer Definition
        var PDA_Color = new w.Color("#b266ff");
        var PDA_Line = new w.SimpleLineSymbol("solid", PDA_Color, 2);
        var PDA_Symbol = new w.SimpleFillSymbol("solid", PDA_Line, new w.Color([178, 102, 255, 1]));
        var PDA_Renderer = new w.SimpleRenderer(PDA_Symbol);

        PDA_FL.setRenderer(PDA_Renderer);
        PDA_FL.setOpacity(PDAFLop);

        //Layer Order can be defined two ways: Using addLayer(layer, index?) where index sets the order for the map. The order is largest number is on top.  Or using addLayers([layer1, layer2, layer3]) Layers at the end have a larger index number.

        //add the legend
        // add the label layer to the map
        //$scope.map.addLayer($scope.labels);

        $scope.map.addLayers([
            PDA_FL,
            TPAsFL,
            studyAreasFL,
            OnStreetInventoryFL,
            OffStreetInventoryFL,
            OnStreetRestrictionsFL,
            OffStreetRestrictionsFL,
            WDOnStreetOccupancyFL,
            WEOnStreetOccupancyFL,
            WDOffStreetOccupancyFL,
            WEOffStreetOccupancyFL,
            PeakOnStreetOccupancyFL,
            PeakOffStreetOccupancyFL,
            vppGraphicsLayer,
            AmtrakFL,
            LightRailFL,
            FerryTerminalsFL,
            ParknRideLotsFL,
            TransitHubsFL,
            BartFL,
            CaltrainFL,
            saLabelsFL
        ]);

        //Set Curent Map Theme
        $scope.pt = "inventory";

        //Map and Featurelayer Utilities
        //switch this method to the angular $scope.on();
        dojo.connect($scope.map, "onZoomEnd", checkScale);

        function showPointLayers() {
            FerryTerminalsFL.show();
            ParknRideLotsFL.show();
            //RailStationsFL.show();
            TransitHubsFL.show();

            $('input[name="FerryTerminalsFL"]').bootstrapSwitch('state', true, true);
            $('input[name="RailStationsFL"]').bootstrapSwitch('state', true, true);
            $('input[name="TransitHubsFL"]').bootstrapSwitch('state', true, true);
            $('input[name="ParknRideLotsFL"]').bootstrapSwitch('state', true, true);
        }


        function hidePointLayers() {
            FerryTerminalsFL.hide();
            ParknRideLotsFL.hide();
            // RailStationsFL.hide();
            TransitHubsFL.hide();

            $('input[name="FerryTerminalsFL"]').bootstrapSwitch('state', false, false);
            $('input[name="RailStationsFL"]').bootstrapSwitch('state', false, false);
            $('input[name="TransitHubsFL"]').bootstrapSwitch('state', false, false);
            $('input[name="ParknRideLotsFL"]').bootstrapSwitch('state', false, false);
        }


        function checkScale(extent, zoomFactor, anchor, level) {
            //console.log("Current Theme: " + $scope.pt);
            $('#CurrentMapZoomLevel').html('<p>Current Map Zoom Level: ' + level + '</p>');
            mapLevel = level;
            if (level > 14) {
                studyAreasFL.on("click", function (evt) {

                });
                //showPointLayers();
                switch ($scope.pt) {
                case "inventory":
                    OnStreetInventoryFL.show();
                    OffStreetInventoryFL.show();

                    $("#mapLegendPNL").fadeIn(500);
                    $("#LegendTitle").text("Legend");
                    $("#LegendNamePNL_TotalSpaces").fadeIn(500);
                    $("#mlegend_TotalSpaces").fadeIn(500);
                    //heatmapFeatureLayer.hide();
                    $("#mlegend_Occ").fadeOut(0);
                    $("#LegendNamePNL_Occ").fadeOut(0);
                    $("#mlegend_Restr").fadeOut(0);
                    $("#LegendNamePNL_Restr").fadeOut(0);
                    break;
                case "restrictions":

                    OnStreetRestrictionsFL.show();
                    OffStreetRestrictionsFL.show();


                    $("#mlegend_Restr").fadeIn(500);
                    $("#LegendNamePNL_Restr").fadeIn(500);

                    $("#LegendNamePNL_Occ").fadeOut(0);
                    $("#mlegend_Occ").fadeOut(0);
                    $("#mlegend_TotalSpaces").fadeOut(0);
                    $("#LegendNamePNL_TotalSpaces").fadeOut(0);

                    break;
                case "wkdayOCC":


                    WDOnStreetOccupancyFL.show();
                    WDOffStreetOccupancyFL.show();



                    $("#LegendNamePNL_Occ").fadeIn(500);
                    $("#mlegend_Occ").fadeIn(500);

                    $("#LegendNamePNL_Restr").fadeOut(0);
                    $("#mlegend_Restr").fadeOut(0);
                    $("#mlegend_TotalSpaces").fadeOut(0);
                    $("#LegendNamePNL_TotalSpaces").fadeOut(0);

                    break;
                case "wkndOCC":


                    WEOnStreetOccupancyFL.show();
                    WEOffStreetOccupancyFL.show();




                    $("#LegendNamePNL_Occ").fadeIn(500);
                    $("#mlegend_Occ").fadeIn(500);

                    $("#LegendNamePNL_Restr").fadeOut(0);
                    $("#mlegend_Restr").fadeOut(0);
                    $("#mlegend_TotalSpaces").fadeOut(0);
                    $("#LegendNamePNL_TotalSpaces").fadeOut(0);

                    break;
                case "peakOCC":
                    PeakOnStreetOccupancyFL.show();
                    PeakOffStreetOccupancyFL.show();

                    $("#LegendNamePNL_Occ").fadeIn(500);
                    $("#mlegend_Occ").fadeIn(500);

                    $("#LegendNamePNL_Restr").fadeOut(0);
                    $("#mlegend_Restr").fadeOut(0);
                    $("#mlegend_TotalSpaces").fadeOut(0);
                    $("#LegendNamePNL_TotalSpaces").fadeOut(0);
                    break;

                }

            } else {
                //hidePointLayers();
                studyAreasFL.on("click", function (evt) {
                    var SAQ_id = evt.graphic.attributes["Project_ID"];
                    /*var highlightGraphic = new w.Graphic(evt.graphic.geometry,highlightSymbol);
                    $scope.map.graphics.add(highlightGraphic);*/
                    ZoomStudyArea(SAQ_id);
                });
                studyAreasFL.show();
                OnStreetInventoryFL.hide();
                OffStreetInventoryFL.hide();
                OnStreetRestrictionsFL.hide();
                OffStreetRestrictionsFL.hide();
                WDOnStreetOccupancyFL.hide();
                WEOnStreetOccupancyFL.hide();
                WDOffStreetOccupancyFL.hide();
                WEOffStreetOccupancyFL.hide();
                PeakOnStreetOccupancyFL.hide();
                PeakOffStreetOccupancyFL.hide();
                $("#mlegend_TotalSpaces").fadeOut(0);
                $("#LegendNamePNL_TotalSpaces").fadeOut(0);
                $("#LegendNamePNL_Occ").fadeOut(0);
                $("#LegendNamePNL_Restr").fadeOut(0);
                $("#mlegend_Occ").fadeOut(0);
                $("#mlegend_Restr").fadeOut(0);
            }
        }

        //End of Map Layer Configuration

        function clearAllTools() {

                //$("#mt").fadeOut(0);
                $("#mapNav").fadeOut(0);
                $("#mapOpts").fadeOut(0);
                $("#mapBasemaps").fadeOut(0);
                $("#mapLayers").fadeOut(0);
                $("#mapPrint").fadeOut(0);
                $("#mapInspector").fadeOut(0);
                $scope.TODbtn = false;
                $scope.PTbtn = false;
                vppGraphicsLayer.clear();
            }
            //UI Listeners

        //Tool Control Listeners


        //Reset Controls in Tool Panel
        $('.clickable').on('click', function () {
            $(this).closest('.panel').fadeOut(300, function () {
                $("#title").text("");
                $('.tools').fadeOut();
            });
            $scope.TODbtn = false;
            $scope.PTbtn = false;

            //$("#PeakTypeOptionsBTN").fadeOut(0);
        });

        $('#mapLegendCTL').on('click', function () {
            $("#mapLegendPNL").fadeIn(500, function () {
                $scope.legendBTN = false;
            });
            $("#LegendTitle").text("Legend");


        });
        $('.clickableLegend').on('click', function () {
            $("#mapLegendPNL").fadeOut(300, function () {
                $("#LegendTitle").text("");
                $scope.legendBTN = true;
            });
        });


        $('.bm').on('click', function () {
            //            console.log($(this).attr('id'));
            $scope.map.setBasemap($(this).attr('id'));
        });

        $('.changeOCCPeriod').on('click', function () {
            //$scope.OCCtimeperiod = $(this).attr('id');
            SetOccupancyRenderer($(this).attr('id').toString());
            $scope.TimePeriod = $(this).text();
            $('#LegendNamePNL_Occ').html("<p><b>" + $scope.DayType + "</b><br/>" + $scope.TimePeriod + " <br/>Percent of total spaces with vehicles occupying spaces </p>");
        });

        $('.parkTheme').on('click', function () {
            OnStreetInventoryFL.hide();
            OffStreetInventoryFL.hide();
            OnStreetRestrictionsFL.hide();
            OffStreetRestrictionsFL.hide();
            WDOnStreetOccupancyFL.hide();
            WEOnStreetOccupancyFL.hide();
            WDOffStreetOccupancyFL.hide();
            WEOffStreetOccupancyFL.hide();
            PeakOnStreetOccupancyFL.hide();
            PeakOffStreetOccupancyFL.hide();

            $scope.pt = $(this).attr('id');
            $scope.TimePeriod = "Early Morning (5AM)";
            $scope.parkingType = "Both On/Off-Street Parking";
            switch ($scope.pt) {
            case "inventory":
                var currentZoomLevel = $scope.map.getZoom();

                if (currentZoomLevel > 14) {
                    OnStreetInventoryFL.show();
                    OffStreetInventoryFL.show();
                    studyAreasFL.show();
                } else {
                    $scope.selectedId = 1;
                    ZoomStudyArea($scope.selectedId);
                    OnStreetInventoryFL.show();
                    OffStreetInventoryFL.show();
                    studyAreasFL.show();
                }

                $scope.TODbtn = false;
                $("#mlegend_TotalSpaces").fadeIn(500);
                $("#LegendNamePNL_TotalSpaces").fadeIn(500);
                $("#LegendNamePNL_Occ").fadeOut(0);
                $("#LegendNamePNL_Restr").fadeOut(0);
                $("#mlegend_Occ").fadeOut(0);
                $("#mlegend_Restr").fadeOut(0);
                //console.log($scope.pt + " | " + $scope.selectedId);

                break;
            case "restrictions":

                $scope.TODbtn = false;
                var currentZoomLevel = $scope.map.getZoom();

                if (currentZoomLevel > 14) {
                    OnStreetRestrictionsFL.show();
                    OffStreetRestrictionsFL.show();
                } else {
                    $scope.selectedId = 1;
                    ZoomStudyArea($scope.selectedId);
                    OnStreetRestrictionsFL.show();
                    OffStreetRestrictionsFL.show();
                }


                $("#mlegend_Restr").fadeIn(500);
                $("#LegendNamePNL_Restr").fadeIn(500);

                $("#LegendNamePNL_Occ").fadeOut(0);
                $("#mlegend_Occ").fadeOut(0);
                $("#mlegend_TotalSpaces").fadeOut(0);
                $("#LegendNamePNL_TotalSpaces").fadeOut(0);
                //console.log($scope.pt + " | " + $scope.selectedId);
                break;
            case "wkdayOCC":
                $scope.TimePeriod = "Early Morning (5AM)";
                SetOccupancyRenderer("Occupancy_5am");
                $scope.TODbtn = true;
                $scope.DayType = "Weekday Occupancy";

                var currentZoomLevel = $scope.map.getZoom();

                if (currentZoomLevel > 14) {
                    WDOnStreetOccupancyFL.show();
                    WDOffStreetOccupancyFL.show();
                } else {
                    $scope.selectedId = 1;
                    ZoomStudyArea($scope.selectedId);
                    WDOnStreetOccupancyFL.show();
                    WDOffStreetOccupancyFL.show();
                }

                $("#LegendNamePNL_Occ").fadeIn(500);
                $("#mlegend_Occ").fadeIn(500);
                $("#LegendNamePNL_Restr").fadeOut(0);
                $("#mlegend_Restr").fadeOut(0);
                $("#mlegend_TotalSpaces").fadeOut(0);
                $("#LegendNamePNL_TotalSpaces").fadeOut(0);
                //Write in the title for the legend item.
                $('#LegendNamePNL_Occ').html("<p><b>" + $scope.DayType + "</b><br/>" + $scope.TimePeriod + "<br/>Percent of total spaces with vehicles occupying spaces</p>");
                //console.log($scope.pt + " | " + $scope.selectedId);
                break;
            case "wkndOCC":
                $scope.TimePeriod = "Early Morning (5AM)";
                SetOccupancyRenderer("Occupancy_5am");
                $scope.TODbtn = true;
                $scope.DayType = "Weekend Occupancy";

                var currentZoomLevel = $scope.map.getZoom();

                if (currentZoomLevel > 14) {
                    WEOnStreetOccupancyFL.show();
                    WEOffStreetOccupancyFL.show();
                } else {
                    $scope.selectedId = 1;
                    ZoomStudyArea($scope.selectedId);
                    WEOnStreetOccupancyFL.show();
                    WEOffStreetOccupancyFL.show();
                }

                $("#LegendNamePNL_Occ").fadeIn(500);
                $("#mlegend_Occ").fadeIn(500);
                $("#LegendNamePNL_Restr").fadeOut(0);
                $("#mlegend_Restr").fadeOut(0);
                $("#mlegend_TotalSpaces").fadeOut(0);
                $("#LegendNamePNL_TotalSpaces").fadeOut(0);
                //Write in the title for the legend item.
                $('#LegendNamePNL_Occ').html("<p><b>" + $scope.DayType + "</b><br/>" + $scope.TimePeriod + " <br/> Percent of total spaces with vehicles occupying spaces </p>");
                //console.log($scope.pt + " | " + $scope.selectedId);
                //console.log("? should be true", $scope.TODbtn);
                break;
            case "peakOCC":
                $scope.parkingType = "Both On/Off-Street Parking";
                var currentZoomLevel = $scope.map.getZoom();

                if (currentZoomLevel > 14) {
                    PeakOnStreetOccupancyFL.show();
                    PeakOffStreetOccupancyFL.show();
                    showPeak("BOTH");
                    //console.log($scope.pt + " | " + $scope.selectedId + " | " + $scope.ptp);
                } else {
                    $scope.selectedId = 1;
                    //SetOccupancyRenderer("Occupancy_12pm");
                    //$scope.DayType = "Weekday Peak Period";
                    //showPeak("BOTH");
                    //$scope.TimePeriod = "Afternoon (12PM)";
                    ZoomStudyArea($scope.selectedId);
                    PeakOnStreetOccupancyFL.show();
                    PeakOffStreetOccupancyFL.show();
                }
                $("#LegendNamePNL_Occ").fadeIn(500);
                $("#mlegend_Occ").fadeIn(500);
                $("#LegendNamePNL_Restr").fadeOut(0);
                $("#mlegend_Restr").fadeOut(0);
                $("#mlegend_TotalSpaces").fadeOut(0);
                $("#LegendNamePNL_TotalSpaces").fadeOut(0);
                //console.log($scope.pt + " | " + $scope.selectedId + " | " + $scope.ptp);
                break;

            }

        });

        $('.pkt').on('click', function () {
            $scope.TODbtn = false;
            $scope.PTbtn = true;
            //$("#PeakTypeOptionsBTN").fadeIn(500);

        });

        function showPeak(a) {
            $scope.TimePeriod = "Early Morning (5AM)";
            $scope.ptp = a;
            $http({
                url: publicDataURL + '/data/getPeak?sa=' + $scope.selectedId + '&pt=' + $scope.ptp,
                method: 'GET'
            }).success(function (data) {
                SetOccupancyRenderer(data[0].Peak);
                $scope.DayType = data[0].Day_Type;

                switch (data[0].Peak) {
                case "Occupancy_5am":
                    $scope.TimePeriod = "Early Morning (5AM)";

                    break;
                case "Occupancy_9am":
                    $scope.TimePeriod = "Morning (9AM)";

                    break;
                case "Occupancy_12pm":
                    $scope.TimePeriod = "Afternoon (12PM)";

                    break;
                case "Occupancy_4pm":
                    $scope.TimePeriod = "Late Afternoon (4PM)";

                    break;
                case "Occupancy_8pm":
                    $scope.TimePeriod = "Evening (8PM)";

                    break;
                }

                switch (a) {
                case "ON":
                    $scope.parkingType = "On-Street Parking";

                    break;
                case "OFF":
                    $scope.parkingType = "Off-Street Parking";

                    break;
                case "BOTH":
                    $scope.parkingType = "Both On/Off-Street Parking";

                }
                $('#LegendNamePNL_Occ').html("<p><b>" + $scope.DayType + "</b><br/>" + $scope.parkingType + "</b><br/>" + $scope.TimePeriod + " <br/>Percent of total spaces with vehicles occupying spaces </p>");

            }).error(function (data, status) {
                console.log("There was an error:", status);

            });

        }

        $('.changePeakPeriod').on('click', function () {
            //console.log($scope.pt + " | " + $scope.selectedId + " | " + $scope.ptp);
            $scope.ptp = $(this).attr('id').toString();
            showPeak($scope.ptp);
            $scope.parkingType = $(this).text();


        });


        $('.occ').on('click', function () {
            $scope.TimePeriod = "Early Morning (5AM)";
            $scope.TODbtn = true;
            //$("#PeakTypeOptionsBTN").fadeOut(0);
            $scope.PTbtn = false;
        });
        $('.mt').on('click', function () {
            //$("#maptypeOptionsBTN").fadeOut(0);
            $scope.TODbtn = false;
            //$("#PeakTypeOptionsBTN").fadeOut(0);
            $scope.PTbtn = false;


        });


        //Show Nav Tools
        $('#mapNavCTL').click(function () {
            clearAllTools();
            $('#iconTitle').html("<span><i class='fa fa-location-arrow fa-lg fa-fw'></i></span>&nbsp;&nbsp;");
            $("#title").text("Map Navigation Tips");
            $("#mapToolsPNL").fadeIn(500);
            $("#mapNav").fadeIn(500);

            //return false;

        });

        //Show Map Options
        $('#mapOptionsCTL').click(function () {
            clearAllTools();
            $('#iconTitle').html("<span><i class='fa fa-ellipsis-h fa-lg fa-fw'></i></span>&nbsp;&nbsp;");
            $("#title").text("Parking Theme");
            $("#mapToolsPNL").fadeIn(500);
            $("#mapOpts").fadeIn(500);

            //return false;

        });
        $('#mapInspectorCTL').click(function () {
            clearAllTools();
            $('#iconTitle').html("<span><i class='fa fa-question fa-lg fa-fw'></i></span>&nbsp;&nbsp;");
            $("#title").text("Parking Inspector");
            $("#mapToolsPNL").fadeIn(500);
            $("#mapInspector").fadeIn(500);
            //Create function to enable Parking Inspector Feature.  This function should turn-on the inspector tool and show information from the Theme that is selected.

            //return false;

        });
        //Parking Theme is on by Default
        $('#iconTitle').html("<span><i class='fa fa-ellipsis-h fa-lg fa-fw'></i></span>&nbsp;&nbsp;");
        $("#title").text("Parking Theme");
        $("#mapToolsPNL").fadeIn(500);
        $("#mapOpts").fadeIn(500);

        //Show BaseMap Controls
        $('#mapBaseCTL').click(function () {
            clearAllTools();
            $('#iconTitle').html("<span><i class='fa fa-globe fa-lg fa-fw'></i></span>&nbsp;&nbsp;");
            $("#title").text("Choose Basemap");
            $("#mapToolsPNL").fadeIn(500);
            $("#mapBasemaps").fadeIn(500);

            //return false;

        });

        $('#HomeButton').click(function () {

            $("#StudyAreaNamePNL").fadeOut(100, function () {
                $("#StudyAreaNamePNL").html("");
            });
            clearAllTools();
            $('#iconTitle').html("<span><i class='fa fa-ellipsis-h fa-lg fa-fw'></i></span>&nbsp;&nbsp;");
            $("#title").text("Parking Theme");
            $("#mapToolsPNL").fadeIn(500);
            $("#mapOpts").fadeIn(500);
        });

        //Map Layer Controls
        $('#mapLayersCTL').click(function () {
            clearAllTools();
            $('#iconTitle').html("<span><i class='fa fa-th-list fa-lg fa-fw'></i></span>&nbsp;&nbsp;");
            $("#title").text("View Layers");
            $("#mapToolsPNL").fadeIn(500);
            $("#mapLayers").fadeIn(500);

            //return false;
        });

        //Show Map Print Controls
        $('#mapPrintCTL').click(function () {
            clearAllTools();
            $('#iconTitle').html("<span><i class='fa fa-print fa-lg fa-fw'></i></span>&nbsp;&nbsp;");
            $("#title").text("Print Tools");
            $("#mapToolsPNL").fadeIn(500);
            $("#mapPrint").fadeIn(500);

            //return false;

        });
        $('#mapRefreshCTL').click(function () {
            OnStreetInventoryFL.hide();
            OffStreetInventoryFL.hide();
            OnStreetRestrictionsFL.hide();
            OffStreetRestrictionsFL.hide();
            WDOnStreetOccupancyFL.hide();
            WDOffStreetOccupancyFL.hide();
            WEOnStreetOccupancyFL.hide();
            WEOffStreetOccupancyFL.hide();
            PeakOnStreetOccupancyFL.hide();
            PeakOffStreetOccupancyFL.hide();
            //COC_FL.hide();
            PDA_FL.hide();
            FerryTerminalsFL.hide();
            ParknRideLotsFL.hide();
            //RailStationsFL.hide();
            TransitHubsFL.hide();
            TPAsFL.hide();
            vppGraphicsLayer.clear();
            $scope.map.centerAndZoom(mapCenter, 11);
            $("#StudyAreaNamePNL").fadeOut(100, function () {
                $("#StudyAreaNamePNL").html("");
            });
            studyAreasFL.show();
            //Reset Values for Opacity Settings
            PDAFLsv = 30;
            PDAFLop = 0.3;
            studyAreasFLsv = 50;
            studyAreasFLop = 0.5;
            TPAsFLsv = 30;
            TPAsFLop = 0.3;
            clearAllTools();
            $('#iconTitle').html("<span><i class='fa fa-ellipsis-h fa-lg fa-fw'></i></span>&nbsp;&nbsp;");
            $("#title").text("Parking Theme");
            $("#mapToolsPNL").fadeIn(500);
            $("#mapOpts").fadeIn(500);


        })

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


        $(".ddStudyAreaSummary").on('click', '.study-li-summary', function (e) {
            //$scope.StudyAreaName = $(this).children('.selected-area').text();
            $scope.selectedStudyAreaMap = $(this).children('.selected-area').text();
            $scope.selectedId = $(this).children('.selected-id').text();
            ZoomStudyArea($scope.selectedId);

        });




        //        $(".find-studyarea").click(function () {
        //            $scope.selectedStudyAreaMap = $(this).children('.selected-area').text();
        //            $scope.selectedId = $(this).children('.selected-id').text();
        //
        //            ZoomStudyArea($scope.selectedId);
        //        });
        //Zoom To Study Area and Highlight Study Area Name in Legend as Current Study Area.
        function ZoomStudyArea(a) {
            saQuery.where = "Project_ID = '" + a + "'";
            StudyAreaQueryTask.execute(saQuery, showSAQResults);
            //What is this switch supposed to be doing?? Check with Nadia.  She might know.
            switch ($scope.pt) {
            case "peakOCC":
                $scope.ptp = "BOTH";
                showPeak($scope.ptp);
                //console.log($scope.pt + " | " + $scope.selectedId + " | " + $scope.ptp);
                break;
            case "inventory":
                //console.log($scope.pt + " | " + $scope.selectedId);
                break;
            case "restrictions":
                //console.log($scope.pt + " | " + $scope.selectedId);
                break;
            case "wkndOCC":
                //console.log($scope.pt + " | " + $scope.selectedId);
                $scope.TODbtn = true;
                break;
            case "wkdayOCC":
                //console.log($scope.pt + " | " + $scope.selectedId);
                $scope.TODbtn = true;
                break;
            }

        }

        function CheckLegendVisibility() {

            if ($('#mapLegendPNL:visible').length == 0) {
                $("#mapLegendPNL").fadeIn(500);
                $("#LegendTitle").text("Legend");

            } else {
                $("#mapLegendPNL").fadeOut(30);
                $("#LegendTitle").text("Legend");
            }

        }

        function getCenterPoint() {
            return $scope.map.extent.getCenter();
        }




        function showSAQResults(saqr) {
            //console.clear();
            //console.log("Showing Study Area Results...");
            vppGraphicsLayer.clear();
            var resultFeatures = saqr.features;

            for (var i = 0, il = resultFeatures.length; i < il; i++) {
                var searchresult = resultFeatures[i];
                searchresult.setSymbol(saq_Symbol);
            }

            vppGraphicsLayer.add(searchresult);

            $('#StudyAreaNamePNL').html("<span><i class='fa fa-map-marker fa-lg fa-fw'></i></span>&nbsp;&nbsp;<b>Selected Study Area:</b><br/>" + searchresult.attributes.Name + "<br /><small><b class='pad-top-m'>Project Notes:</b><br />" + searchresult.attributes.Notes + "</small>");
            $("#StudyAreaNamePNL").fadeIn(100);
            $scope.map.setExtent(searchresult.geometry.getExtent(), true);
            $("#StudyAreaSearch").val("");

        }


        //Global Switch for all check boxes as toggle switches
        $("input[type=\"checkbox\"], input[type=\"radio\"]").not("[data-switch-no-init]").bootstrapSwitch();
        $("input[type=\"checkbox\"], input[type=\"radio\"]").on('switchChange.bootstrapSwitch', function (event, state) {
            var LayerName = $(this).attr('name');


            var visibleLayerIds = [];

            if (state) {
                switch (LayerName) {
                case "PDA_FL":
                    PDA_FL.show();
                    $("#mlegend_pdas").fadeIn(100);
                    $("#policyLayersCat").fadeIn(100);
                    //$("#PDAsOpacitySlider").fadeIn(100);
                    //$scope.toggleDevArea();
                    //$scope.isActiveDev = !$scope.isActive;
                    $('#PDAsOpacitySlider').removeClass('hide-fixer');
                    break;
                case "studyAreasFL":
                    studyAreasFL.show();
                    $('#StudyAreaOpacitySlider').removeClass('hide-fixer');

                    break;
                case "FerryTerminalsFL":

                    FerryTerminalsFL.show();
                    $("#mlegend_ferry").fadeIn(100);
                    $("#transitLayersCat").fadeIn(100);

                    break;
                case "ParknRideLotsFL":
                    ParknRideLotsFL.show();
                    $("#mlegend_parknride").fadeIn(100);

                    break;

                case "TransitHubsFL":
                    TransitHubsFL.show();
                    $("#mlegend_transitHubs").fadeIn(100);
                    $("#transitLayersCat").fadeIn(100);
                    break;
                case "TPAsFL":
                    TPAsFL.show();
                    $("#mlegend_tpas").fadeIn(100);
                    $("#policyLayersCat").fadeIn(100);
                    //$("#TPAsOpacitySlider").fadeIn(100);
                    //$scope.toggleTransArea();
                    //$scope.isActiveTrans = !$scope.isActive;
                    $('#TPAsOpacitySlider').removeClass('hide-fixer');

                    break;
                case "BartFL":
                    BartFL.show();
                    $("#mlegend_bart").fadeIn(100);
                    $("#transitLayersCat").fadeIn(100);
                    break;

                case "CaltrainFL":
                    CaltrainFL.show();
                    $("#mlegend_caltrain").fadeIn(100);
                    $("#transitLayersCat").fadeIn(100);
                    break;
                case "AmtrakFL":
                    AmtrakFL.show();
                    $("#mlegend_amtrak").fadeIn(100);
                    $("#transitLayersCat").fadeIn(100);
                    break;
                case "LightRailFL":
                    LightRailFL.show();
                    $("#mlegend_lightrail").fadeIn(100);
                    $("#transitLayersCat").fadeIn(100);
                    break;
                }
            } else {
                switch (LayerName) {
                case "PDA_FL":
                    PDA_FL.hide();
                    $("#mlegend_pdas").fadeOut(0);
                    //$("#PDAsOpacitySlider").fadeOut(100);
                    $('#PDAsOpacitySlider').addClass('hide-fixer');
                    if (TPAsFL.visible) {} else {

                        $("#policyLayersCat").fadeOut(0);
                    }
                    break;
                case "studyAreasFL":
                    studyAreasFL.hide();
                    $('#StudyAreaOpacitySlider').addClass('hide-fixer');
                    break;
                case "FerryTerminalsFL":
                    FerryTerminalsFL.hide();
                    $("#mlegend_ferry").fadeOut(0);
                    if (BartFL.visible || CaltrainFL.visible || AmtrakFL.visible || LightRailFL.visible || TransitHubsFL.visible) {} else {

                        $("#transitLayersCat").fadeOut(0);
                    }
                    break;
                case "ParknRideLotsFL":
                    ParknRideLotsFL.hide();
                    $("#mlegend_parknride").fadeOut(0);
                    break;

                    break;
                case "TransitHubsFL":
                    TransitHubsFL.hide();
                    $("#mlegend_transitHubs").fadeOut(0);
                    if (BartFL.visible || CaltrainFL.visible || AmtrakFL.visible || LightRailFL.visible || FerryTerminalsFL.visible) {} else {

                        $("#transitLayersCat").fadeOut(0);
                    }
                    break;

                    break;
                case "TPAsFL":
                    TPAsFL.hide();
                    $("#mlegend_tpas").fadeOut(0);
                    //$("#TPAsOpacitySlider").fadeOut(100);
                    $('#TPAsOpacitySlider').addClass('hide-fixer');
                    if (PDA_FL.visible) {

                    } else {

                        $("#policyLayersCat").fadeOut(0);
                    }
                    break;
                case "BartFL":
                    BartFL.hide();
                    $("#mlegend_bart").fadeOut(100);
                    if (FerryTerminalsFL.visible || CaltrainFL.visible || AmtrakFL.visible || LightRailFL.visible || TransitHubsFL.visible) {} else {

                        $("#transitLayersCat").fadeOut(0);
                    }
                    break;

                case "CaltrainFL":
                    CaltrainFL.hide();
                    $("#mlegend_caltrain").fadeOut(100);
                    if (FerryTerminalsFL.visible || BartFL.visible || AmtrakFL.visible || LightRailFL.visible || TransitHubsFL.visible) {} else {

                        $("#transitLayersCat").fadeOut(0);
                    }
                    break;
                case "AmtrakFL":
                    AmtrakFL.hide();
                    $("#mlegend_amtrak").fadeOut(100);
                    if (FerryTerminalsFL.visible || BartFL.visible || CaltrainFL.visible || LightRailFL.visible || TransitHubsFL.visible) {} else {

                        $("#transitLayersCat").fadeOut(0);
                    }
                    break;
                case "LightRailFL":
                    LightRailFL.hide();
                    $("#mlegend_lightrail").fadeOut(100);
                    if (FerryTerminalsFL.visible || BartFL.visible || CaltrainFL.visible || AmtrakFL.visible || TransitHubsFL.visible) {} else {

                        $("#transitLayersCat").fadeOut(0);
                    }
                    break;
                }
            }
        });


        //Slider Controls
        $scope.vm.opacitySlider = {
            floor: 0,
            ceil: 100,
            value: 50
        };

        $scope.vm.opacitySlider1 = {
            floor: 0,
            ceil: 100,
            value: 30
        };

        $scope.vm.opacitySlider2 = {
            floor: 0,
            ceil: 100,
            value: 30
        };

        $scope.$on("slideEnded", function () {
            //console.clear();
            studyAreasFLsv = $scope.vm.opacitySlider.value;
            studyAreasFLop = (studyAreasFLsv / 100);
            studyAreasFL.setOpacity(studyAreasFLop);
            studyAreasFL.refresh();
            console.log(studyAreasFLop);
            TPAsFLsv = $scope.vm.opacitySlider2.value;
            TPAsFLop = (TPAsFLsv / 100);
            TPAsFL.setOpacity(TPAsFLop);
            TPAsFL.refresh();
            console.log(TPAsFLop);
            PDAFLsv = $scope.vm.opacitySlider1.value;
            PDAFLop = (PDAFLsv / 100);
            PDA_FL.setOpacity(PDAFLop);
            PDA_FL.refresh();
            console.log(PDAFLop);
        });

        $scope.activeTheme = function (event) {

            //Grab attribute
            var view = $(event.target).parent(".thumbnail").attr('view');

            //Active theme Classes
            $('.thumbnail').removeClass('active');
            $(event.target).parent(".thumbnail").addClass('active');

            //show and hist peak&time buttons
            if (view === "time") {

                //turn on time button
                $scope.timeButton = true;
                $scope.TimePeriod = "Early Morning (5AM)";
                //turn off the peak button
                $scope.peakButton = false;
            } else if (view === "peak") {

                //turn off time button
                $scope.timeButton = false;

                //turn on the peak button
                $scope.peakButton = true;
            } else {

                //turn off time button
                $scope.timeButton = false;

                //turn off the peak button
                $scope.peakButton = false;
            }

            console.log(view);
        };

        //Load Study Area from Parking Data
        $.urlParam = function (name) {
            var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
            if (results == null) {
                return null;
            } else {
                return results[1] || 0;
            }
        }
        var hasURLparam = decodeURIComponent($.urlParam('sa'));
        if (hasURLparam > 0) {
            var sa = decodeURIComponent($.urlParam('sa'));
            ZoomStudyArea(sa);
        }
        //End of Study Area from Parking Data


        $scope.showLayers = function () {
            $("#mapLayers").removeClass('vHidden').removeClass('zero-h');
        };
		
		//Print Methods
		$scope.printPreview = function(){
			$scope.printingMode = false;
			$scope.printWindow();
			console.log("PrintPreview", $scope.printingMode);	
		};
		
        $scope.printMap = function () {
            $scope.createElement(document.getElementById("map"), "print-map");
            $scope.createElement(document.getElementById("mapLegend"), "print-legend");
            print();
        };
		
		$scope.printWindow = function () {
            $scope.printActive = !$scope.printActive;
        }
        
        $scope.exit = function(){
	        $scope.printActive = !$scope.printActive;
			$scope.printingMode = true;
        };
        		
        $scope.createElement = function (element, print) {

            $scope.node = element.cloneNode(true);
            $scope.printerElement = document.getElementById(print);

            if (!$scope.printerElement) {
                $scope.printerElement = document.createElement("div");
                $scope.printerElement.id = print;
                document.body.appendChild($scope.printerElement);
            }

            $scope.printerElement.innerHTML = "";

            $scope.printerElement.appendChild($scope.node);
        };

        //For opcacity switches.  Make sure that this section includes the same option for the Study Areas.
        $scope.toggleDevArea = function (event) {
            $scope.isActiveDev = !$scope.isActiveDev;
            if ($scope.isActiveDev === true) {
                $scope.switchButton = "On";
                $(event.target).closest('.toggle-button').addClass("btn-primary").removeClass('btn-default');
            } else if ($scope.isActiveDev === false) {
                $scope.switchButton = 'Off';
                $('.toggle-button').addClass("btn-default").removeClass('btn-primary');
            }


            //console.log('Dev', $scope.isActiveDev);
        };
        $scope.toggleTransArea = function (event) {
            $scope.isActiveTrans = !$scope.isActiveTrans;
            if ($scope.isActiveTrans === true) {
                $scope.switchButton = "On";
                $(event.target).closest('.toggle-button').addClass("btn-primary").removeClass('btn-default');
            } else if ($scope.isActiveTrans === false) {
                $scope.switchButton = 'Off';
                $(event.target).closest('.toggle-button').addClass("btn-default").removeClass('btn-primary');
            }
        };
        studyAreasFL.on("click", function (evt) {
            var SAQ_id = evt.graphic.attributes["Project_ID"];
            ZoomStudyArea(SAQ_id);
        });
        $('#CurrentMapZoomLevel').html('<p>Current Map Zoom Level: 11</p>'); 
    });

//EOF