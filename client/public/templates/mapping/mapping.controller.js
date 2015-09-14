'use strict';

angular.module('vppApp')
    .controller('MapCtrl', function ($rootScope, $scope, wish) {

        var w = wish.get(),
            OnStreetInventoryFL,
            OffStreetInventoryFL,
            WDOffStreetOccupancyFL,
            WDOnStreetOccupancyFL,
            WEOffStreetOccupancyFL,
            WEOnStreetOccupancyFL,
            markerSym,
            renderer1,
            renderer2,
            sls,
            sfs,
            popup,
            popupOptions,
            popupTemplate_OnStreetInventoryFL,
            symbol,
            symbol_OnStreetOccupancy,
            OffStreetInventoryURL,
            OnStreetInventoryURL,
            WDOffStreetOccupancyURL,
            WDOnStreetOccupancyURL,
            WEOffStreetOccupancyURL,
            WEOnStreetOccupancyURL,
            StudyAreaURL,
            StudyAreaQueryTask,
            saq_Color,
            saq_Line,
            saq_Symbol,
            saQuery,
            saInfoTemplate,
            vppGraphicsLayer,
            mapCenter


        w.parser.parse();
        w.esriConfig.defaults.geometryService = new w.GeometryService("http://gis.mtc.ca.gov/mtc/rest/services/Utilities/Geometry/GeometryServer");


        sls = new w.SimpleLineSymbol("solid", new w.Color("#444444"), 3);
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

        //Study Area URLs
        StudyAreaURL = 'http://gis.mtc.ca.gov/mtc/rest/services/VPP/Alpha_Map/MapServer/6'

        //QueryTasks
        StudyAreaQueryTask = new w.QueryTask(StudyAreaURL);
        //Study Area Query Result Renderer
        saq_Color = new w.Color("#007AC8");
        saq_Line = new w.SimpleLineSymbol("solid", saq_Color, 5);
        saq_Symbol = new w.SimpleFillSymbol("solid", saq_Line, "#fff");

        saQuery = new w.Query();
        saQuery.returnGeometry = true;
        saQuery.outFields = ["*"];

        saInfoTemplate = new w.InfoTemplate("Selected Study Area", "<p><b>${Name}</b></p><p>City: ${City}</p><p>Project Title: ${Title}</p><p>Collection Year: ${CollectionYear}</p><p>Consultant: ${Consultant}</p>");


        //create a popup to replace the map's info window
        popup = new w.Popup(popupOptions, w.domConstruct.create("div"));

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
        //Set Map Center Variable. Used to reset map when user clicks reset map btn.
        $scope.map.on("load", function () {
            mapCenter = getCenterPoint();
        });


        var home = new w.HomeButton({
            map: $scope.map
        }, "HomeButton");
        home.startup();

        vppGraphicsLayer = new w.GraphicsLayer({
            opacity: 0.50
        });

        $scope.map.addLayer(vppGraphicsLayer);


        //Define Feature Layers for Map
        popupTemplate_OnStreetInventoryFL = new w.PopupTemplate({
            "title": "Parking Spaces by Block Face",
            "fieldInfos": [{
                    "fieldName": "Total_Spaces",
                    "label": "Total Spaces",
                    "format": {
                        "places": 0,
                        "digitSeparator": true
                    }
            }
        ],
            "description": "There are {Total_Spaces} total parking spaces on this block"
        });

        OnStreetInventoryFL = new w.FeatureLayer(OnStreetInventoryURL, {
            id: "OnStreetInventory",
            mode: w.FeatureLayer.MODE_SNAPSHOT,
            outFields: ["*"],
            infoTemplate: popupTemplate_OnStreetInventoryFL
        });


        OffStreetInventoryFL = new w.FeatureLayer(OffStreetInventoryURL, {
            id: "OffStreetInventory",
            mode: w.FeatureLayer.MODE_SNAPSHOT,
            outFields: ["*"]
            //infoTemplate: popupTemplate_OnStreetInventoryFL
        });

        WDOffStreetOccupancyFL = new w.FeatureLayer(WDOffStreetOccupancyURL, {
            id: "WDOffStreetOccupancy",
            mode: w.FeatureLayer.MODE_SNAPSHOT,
            outFields: ["*"]
           // infoTemplate: popupTemplate_OnStreetInventoryFL
        });

        WDOnStreetOccupancyFL = new w.FeatureLayer(WDOnStreetOccupancyURL, {
            id: "WDOnStreetOccupancy",
            mode: w.FeatureLayer.MODE_SNAPSHOT,
            outFields: ["*"]
           // infoTemplate: popupTemplate_OnStreetInventoryFL
        });

        WEOffStreetOccupancyFL = new w.FeatureLayer(WEOffStreetOccupancyURL, {
            id: "WEOffStreetOccupancy",
            mode: w.FeatureLayer.MODE_SNAPSHOT,
            outFields: ["*"]
           // infoTemplate: popupTemplate_OnStreetInventoryFL
        });

        WEOnStreetOccupancyFL = new w.FeatureLayer(WEOnStreetOccupancyURL, {
            id: "WEOnStreetOccupancy",
            mode: w.FeatureLayer.MODE_SNAPSHOT,
            outFields: ["*"]
           // infoTemplate: popupTemplate_OnStreetInventoryFL
        });


        //end of layer definitions




        //Set Map Renderers for OnStreetInventoryFL
        symbol = new w.SimpleLineSymbol(w.SimpleLineSymbol.STYLE_SOLID,
            new w.Color([255, 0, 0]));
        var renderer = new w.ClassBreaksRenderer(symbol, "Total_Spaces");

        var Break1Color = new w.Color([56, 168, 0, 1]);
        var Break1LineSymbol = new w.SimpleLineSymbol("solid", Break1Color, 3);

        var Break2Color = new w.Color([139, 209, 0, 1]);
        var Break2LineSymbol = new w.SimpleLineSymbol("solid", Break2Color, 3);

        var Break3Color = new w.Color([255, 255, 0, 1]);
        var Break3LineSymbol = new w.SimpleLineSymbol("solid", Break3Color, 3);

        var Break4Color = new w.Color([255, 128, 0, 1]);
        var Break4LineSymbol = new w.SimpleLineSymbol("solid", Break4Color, 3);

        var Break5Color = new w.Color([255, 0, 0, 1]);
        var Break5LineSymbol = new w.SimpleLineSymbol("solid", Break5Color, 3);

        var Break1_minValue = 0;
        var Break1_maxValue = 6;

        var Break2_minValue = 7;
        var Break2_maxValue = 14;

        var Break3_minValue = 15;
        var Break3_maxValue = 26;

        var Break4_minValue = 27;
        var Break4_maxValue = 54;

        var Break5_minValue = 55;
        var Break5_maxValue = 116;

        renderer.addBreak(Break1_minValue, Break1_maxValue, Break1LineSymbol);
        renderer.addBreak(Break2_minValue, Break2_maxValue, Break2LineSymbol);
        renderer.addBreak(Break3_minValue, Break3_maxValue, Break3LineSymbol);
        renderer.addBreak(Break4_minValue, Break4_maxValue, Break4LineSymbol);
        renderer.addBreak(Break5_minValue, Break5_maxValue, Break5LineSymbol);

        OnStreetInventoryFL.setRenderer(renderer);


        //OnStreetInventoryFL.maxScale = 30000;
        $scope.map.addLayer(OnStreetInventoryFL);
        OnStreetInventoryFL.hide();




        //Set Map Renderers for WDOnStreetOccupancyFL and WEOnStreetOccupancyFL
        symbol_OnStreetOccupancy = new w.SimpleLineSymbol(w.SimpleLineSymbol.STYLE_SOLID,
            new w.Color([255, 0, 0]));
        var renderer_OnStreetOccupancy = new w.ClassBreaksRenderer(symbol_OnStreetOccupancy, "Occupancy_5am");

        var Break1Color_OnStreetOccupancy = new w.Color([56, 168, 0, 1]);
        var Break1LineSymbol_OnStreetOccupancy = new w.SimpleLineSymbol("solid", Break1Color_OnStreetOccupancy, 3);

        var Break2Color_OnStreetOccupancy = new w.Color([139, 209, 0, 1]);
        var Break2LineSymbol_OnStreetOccupancy = new w.SimpleLineSymbol("solid", Break2Color_OnStreetOccupancy, 3);

        var Break3Color_OnStreetOccupancy = new w.Color([255, 255, 0, 1]);
        var Break3LineSymbol_OnStreetOccupancy = new w.SimpleLineSymbol("solid", Break3Color_OnStreetOccupancy, 3);

        var Break4Color_OnStreetOccupancy = new w.Color([255, 128, 0, 1]);
        var Break4LineSymbol_OnStreetOccupancy = new w.SimpleLineSymbol("solid", Break4Color_OnStreetOccupancy, 3);

        var Break5Color_OnStreetOccupancy = new w.Color([255, 0, 0, 1]);
        var Break5LineSymbol_OnStreetOccupancy = new w.SimpleLineSymbol("solid", Break5Color_OnStreetOccupancy, 3);

        var Break1_minValue_OnStreetOccupancy = 0;
        var Break1_maxValue_OnStreetOccupancy = 0.5;

        var Break2_minValue_OnStreetOccupancy = 0.51;
        var Break2_maxValue_OnStreetOccupancy = 0.75;

        var Break3_minValue_OnStreetOccupancy = 0.76;
        var Break3_maxValue_OnStreetOccupancy = 0.85;

        var Break4_minValue_OnStreetOccupancy = 0.86;
        var Break4_maxValue_OnStreetOccupancy = 0.95;

        var Break5_minValue_OnStreetOccupancy = 0.96;
        var Break5_maxValue_OnStreetOccupancy = 1;

        renderer_OnStreetOccupancy.addBreak(Break1_minValue_OnStreetOccupancy, Break1_maxValue_OnStreetOccupancy, Break1LineSymbol_OnStreetOccupancy);
        renderer_OnStreetOccupancy.addBreak(Break2_minValue_OnStreetOccupancy, Break2_maxValue_OnStreetOccupancy, Break2LineSymbol_OnStreetOccupancy);
        renderer_OnStreetOccupancy.addBreak(Break3_minValue_OnStreetOccupancy, Break3_maxValue_OnStreetOccupancy, Break3LineSymbol_OnStreetOccupancy);
        renderer_OnStreetOccupancy.addBreak(Break4_minValue_OnStreetOccupancy, Break4_maxValue_OnStreetOccupancy, Break4LineSymbol_OnStreetOccupancy);
        renderer_OnStreetOccupancy.addBreak(Break5_minValue_OnStreetOccupancy, Break5_maxValue_OnStreetOccupancy, Break5LineSymbol_OnStreetOccupancy);

        WDOnStreetOccupancyFL.setRenderer(renderer_OnStreetOccupancy);
        WEOnStreetOccupancyFL.setRenderer(renderer_OnStreetOccupancy);


        $scope.map.addLayer(WDOnStreetOccupancyFL);
        WDOnStreetOccupancyFL.hide();

        $scope.map.addLayer(WEOnStreetOccupancyFL);
        //WEOnStreetOccupancyFL.hide();












        //Setting up Simple Lines Renderer for Study Areas
        var studyAreasColor = new w.Color("#999");
        var studyAreasLine = new w.SimpleLineSymbol("solid", studyAreasColor, 5);
        var studyAreasSymbol = new w.SimpleFillSymbol("solid", studyAreasLine, null);
        var studyAreasRenderer = new w.SimpleRenderer(studyAreasSymbol);

        var studyAreasFL = new w.FeatureLayer("http://gis.mtc.ca.gov/mtc/rest/services/VPP/Alpha_Map/MapServer/6", {
            mode: w.FeatureLayer.MODE_SNAPSHOT,
            outFields: ["*"]

        });

        studyAreasFL.setRenderer(studyAreasRenderer);
        $scope.map.addLayer(studyAreasFL);
        studyAreasFL.hide();

        //PDA Popup and Feature Layer Definition
        var PDA_Color = new w.Color("#b266ff");
        var PDA_Line = new w.SimpleLineSymbol("solid", PDA_Color, 3);
        var PDA_Symbol = new w.SimpleFillSymbol("solid", PDA_Line, null);
        var PDA_Renderer = new w.SimpleRenderer(PDA_Symbol);

        var PDA_FL = new w.FeatureLayer("http://gis.mtc.ca.gov/mtc/rest/services/OBAG_PDA/OBAG_PDA/MapServer/0", {
            mode: w.FeatureLayer.MODE_SNAPSHOT,
            outFields: ["*"]

        });

        PDA_FL.setRenderer(PDA_Renderer);
        $scope.map.addLayer(PDA_FL);
        PDA_FL.hide();

        //COC Popup and Feature Layer Definition
        var popupTemplate_COC_FL = new w.PopupTemplate({
            "title": "Community of Concern",
            "fieldInfos": [{
                    "fieldName": "totpop",
                    "label": "Total Population",
                    "format": {
                        "places": 0,
                        "digitSeparator": true
                    }
         }
        ],
            "description": "Total population is {totpop}"
        });

        var COC_FL = new w.FeatureLayer("http://gis.mtc.ca.gov/mtc/rest/services/Open_Data/Open_Data_Layers/MapServer/14", {
            id: "COC",
            mode: w.FeatureLayer.MODE_SNAPSHOT,
            outFields: ["*"],
            infoTemplate: popupTemplate_COC_FL

        });

        COC_FL.setDefinitionExpression("cocflag = 1");


        //Feature Layer Renderer for COCs
        var COC_Color = new w.Color("#ff9999");
        var COC_Line = new w.SimpleLineSymbol("solid", COC_Color, 3);
        var COC_Symbol = new w.SimpleFillSymbol("solid", COC_Line, null);
        var COC_Renderer = new w.SimpleRenderer(COC_Symbol);
        COC_FL.setRenderer(COC_Renderer);

        $scope.map.addLayer(COC_FL);
        COC_FL.hide();

        //Heatmap Renderer for BlockFaces
        var infoTemplate = new w.InfoTemplate("Attributes",
            "Total Spaces: ${Total_Spaces_1}");

        var serviceURL = "http://gis.mtc.ca.gov/mtc/rest/services/VPP/vpp_V7/FeatureServer/0";
        var heatmapFeatureLayerOptions = {
            mode: w.FeatureLayer.MODE_SNAPSHOT,
            outFields: ["Total_Spaces_1"] //,
                //infoTemplate: infoTemplate
        };
        var heatmapFeatureLayer = new w.FeatureLayer(serviceURL, heatmapFeatureLayerOptions);

        //var blurCtrl = document.getElementById("blurControl");
        //var maxCtrl = document.getElementById("maxControl");
        //var minCtrl = document.getElementById("minControl");
        //var valCtrl = document.getElementById("valueControl");

        var heatmapRenderer = new w.HeatmapRenderer({
            field: "Total_Spaces_1",
            blurRadius: 7,
            maxPixelIntensity: 850,
            minPixelIntensity: 0
        });

        heatmapFeatureLayer.setRenderer(heatmapRenderer);
        $scope.map.addLayer(heatmapFeatureLayer);
        heatmapFeatureLayer.show();


        //Map and Featurelayer Utilities
        dojo.connect($scope.map, "onZoomEnd", checkScale);

        function checkScale(extent, zoomFactor, anchor, level) {
            //document.getElementById("myText").value = level;
            //console.clear();
            //console.log(level);
            if (level > 14) {
                OnStreetInventoryFL.show();
                heatmapFeatureLayer.hide();
            } else {
                OnStreetInventoryFL.hide();
                heatmapFeatureLayer.show();
                //console.log('Heat Map Visible!')
            }
        }

        //End of Map Layer Configuration

        function clearAllTools() {
                $("#mapNav").fadeOut(0);
                $("#mapOpts").fadeOut(0);
                $("#mapBasemaps").fadeOut(0);
                $("#mapLayers").fadeOut(0);
                $("#mapPrint").fadeOut(0);
                $("#maptypeOptionsBTN").fadeOut(0);
            }
            //UI Listeners

        //Tool Control Listeners

        //Reset Controls in Tool Panel
        $('.clickable').on('click', function () {
            $(this).closest('.panel').fadeOut(300, function () {
                $("#title").text("");
                $('.tools').fadeOut();
            });
        });

        $('#mapLegendCTL').on('click', function () {
            $("#mapLegendPNL").fadeIn(500);
            $("#LegendTitle").text("Legend");

        });
        $('.clickableLegend').on('click', function () {
            $("#mapLegendPNL").fadeOut(300, function () {
                $("#LegendTitle").text("");
            });


        });


        $('.bm').on('click', function () {
            //            console.log($(this).attr('id'));
            $scope.map.setBasemap($(this).attr('id'));
        });
        $('.occ').on('click', function () {
            //console.log($(this).attr('id'));
            $("#maptypeOptionsBTN").fadeIn(500);
        });
        $('.mt').on('click', function () {
            $("#maptypeOptionsBTN").fadeOut(500);
            //console.log($(this).attr('id'));

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

        //Show BaseMap Controls
        $('#mapBaseCTL').click(function () {
            clearAllTools();
            $('#iconTitle').html("<span><i class='fa fa-globe fa-lg fa-fw'></i></span>&nbsp;&nbsp;");
            $("#title").text("Choose Basemap");
            $("#mapToolsPNL").fadeIn(500);
            $("#mapBasemaps").fadeIn(500);

            //return false;

        });

        //SMap Layer Controls
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

            vppGraphicsLayer.clear();
            $scope.map.centerAndZoom(mapCenter, 11);
            $("#mapLegendPNL").fadeOut(300, function () {
                $("#LegendTitle").text("");
            });

        })

        //Data Builder
        //Load data for Study Area Search Function
        $.ajax({
            dataType: 'json',
            url: publicDataURL + '/data/studyareas',
            success: function (data) {
                //console.clear();
                //console.log(data);
                for (var i = 0; i < data.length; i++) {
                    $("#studyareas-list").append('<option data-number=' + data[i].Project_ID + '>' + data[i].City + ": " + data[i].Name + '</option>');
                }
            }
        });


        $(".find-studyarea").click(function () {
            var san = $("#StudyAreaSearch").val();
            var sanValue = $('#studyareas-list option').filter(function () {
                return this.value == san;
                //console.log(this);
            }).data('number');

            ZoomStudyArea(sanValue);
        });
        //Zoom To Study Area and Highlight Study Area Name in Legend as Current Study Area.
        function ZoomStudyArea(sanValue) {
            saQuery.where = "Project_ID = '" + sanValue + "'";
            StudyAreaQueryTask.execute(saQuery, showSAQResults);

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
            CheckLegendVisibility();
            vppGraphicsLayer.clear();
            var resultFeatures = saqr.features;
            console.log(saqr);
            //console.log(resultFeatures);
            for (var i = 0, il = resultFeatures.length; i < il; i++) {
                var searchresult = resultFeatures[i];
                searchresult.setSymbol(saq_Symbol);
            }
            searchresult.setInfoTemplate(saInfoTemplate);
            //$scope.map.graphics.add(searchresult);
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

            //console.log($(this).attr('name')); // DOM element
            //console.log(event); // jQuery event
            //console.log(state); // true | false

            if (state) {
                switch (LayerName) {
                case "PDA_FL":
                    PDA_FL.show();
                    break;
                case "COC_FL":
                    COC_FL.show();
                    break;
                case "studyAreasFL":
                    studyAreasFL.show();
                    break;

                }
            } else {
                switch (LayerName) {
                case "PDA_FL":
                    PDA_FL.hide();
                    break;
                case "COC_FL":
                    COC_FL.hide();
                    break;
                case "studyAreasFL":
                    studyAreasFL.hide();
                    break;
                }
            }

        });

    });