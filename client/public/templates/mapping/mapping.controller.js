'use strict';

angular.module('vppApp')
    .controller('MapCtrl', function ($rootScope, $scope, wish) {

        var w = wish.get(),
            blockFacesFL,
            markerSym,
            renderer1,
            renderer2,
            sls,
            sfs,
            popup,
            popupOptions,
            popupTemplate_blockFacesFL,
            symbol,

            BlockFaceURL = 'http://gis.mtc.ca.gov/mtc/rest/services/VPP/vpp_V7/FeatureServer/2';

        w.parser.parse();
        w.esriConfig.defaults.geometryService = new w.GeometryService("http://tasks.arcgisonline.com/ArcGIS/rest/services/Geometry/GeometryServer");


        sls = new w.SimpleLineSymbol("solid", new w.Color("#444444"), 3);
        sfs = new w.SimpleFillSymbol("solid", sls, new w.Color([68, 68, 68, 0.25]));

        popupOptions = {
            fillSymbol: sfs,
            marginLeft: "20",
            marginTop: "20"
        };

        //create a popup to replace the map's info window
        popup = new w.Popup(popupOptions, w.domConstruct.create("div"));

        //Define Primary Basemap
        $scope.map = new w.Map('map', {
            center: [-122.416, 37.783],
            zoom: 11,
            minZoom: 3,
            maxZoom: 20,
            infoWindow: popup,
            basemap: 'topo'
        });

        //Define Feature Layers for Map
        popupTemplate_blockFacesFL = new w.PopupTemplate({
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

        blockFacesFL = new w.FeatureLayer(BlockFaceURL, {
            id: "blockFaces",
            mode: w.FeatureLayer.MODE_SNAPSHOT,
            outFields: ["*"],
            infoTemplate: popupTemplate_blockFacesFL
        });
        //layer.setDefinitionExpression('AREA>0.01 and M086_07>0');

        //Set Map Renderers
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
        blockFacesFL.setRenderer(renderer);


        //blockFacesFL.maxScale = 30000;
        $scope.map.addLayer(blockFacesFL);
        blockFacesFL.hide();

        //Setting up Simple Lines Renderer for Study Areas
        var studyAreasColor = new w.Color("#999");
        var studyAreasLine = new w.SimpleLineSymbol("solid", studyAreasColor, 5);
        var studyAreasSymbol = new w.SimpleFillSymbol("solid", studyAreasLine, null);
        var studyAreasRenderer = new w.SimpleRenderer(studyAreasSymbol);

        var studyAreasFL = new w.FeatureLayer("http://gis.mtc.ca.gov/mtc/rest/services/VPP/vpp_V7/MapServer/3", {
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
            console.clear();
            console.log(level);
            if (level > 14) {
                blockFacesFL.show();
                heatmapFeatureLayer.hide();
            } else {
                blockFacesFL.hide();
                heatmapFeatureLayer.show();
                console.log('Heat Map Visible!')
            }
        }

    });