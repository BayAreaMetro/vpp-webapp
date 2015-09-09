var app = (function () {
    return {
        features: [],
        /**
         * Clears the map contents.
         */
        clearMap: function () {
            var i;
            // Reset the remembered last string (so that we can clear the map,
            //  paste the same string, and see it again)
            //document.getElementById('wkt').last = '';
            for (i = 0; i < this.features.length; i += 1) {
                this.map.graphics.remove(this.features[i]);
            }
            //this.features.length = 0;
        },
        /**
         * Clears the current contents of the textarea.
         */
        getData: function () {
            //$.getJSON("/data/vmt?id=" + v + "&mr=" + b
            $.getJSON("/data/ocupancywd", function (data) {

                $(app.mapIt(data, false, true));

            });
        },
        clearText: function () {
            //document.getElementById('wkt').value = '';
        },
        /**
         * Maps the current contents of the textarea.
         * @param   editable    {Boolean}   Indicates that the feature drawn should be editable
         * @param   focus       {Boolean}   Indicates that the map should pan and/or zoom to new features
         * @return              {Object}    Some sort of geometry object
         */
        mapIt: function (data, editable, focus) {
            var config, el, graphic, obj, symbol, wkt;
            // Indicates that the map should pan and/or zoom to new features
            focus = focus || true;
            if (editable === undefined) {
                editable = false;
            }
            //el = document.getElementById('wkt');
            wkt = new Wkt.Wkt();
            wkt.read(data[0].WKT);
            //            if (el.last === el.value) { // Remember the last string
            //                return; // Do nothing if the WKT string hasn't changed
            //            } else {
            //                el.last = el.value;
            //            }
            //            try { // Catch any malformed WKT strings
            //                wkt.read(el.value);
            //            } catch (e1) {
            //                try {
            //                    wkt.read(el.value.replace('\n', '').replace('\r', '').replace('\t', ''));
            //                } catch (e2) {
            //                    if (e2.name === 'WKTError') {
            //                        alert('Wicket could not understand the WKT string you entered. Check that you have parentheses balanced, and try removing tabs and newline characters.');
            //                        return;
            //                    }
            //                }
            //            }

            config = {
                spatialReference: {
                    wkid: 3857 // 4326 WGS84 unprojected 3857 Web Mercator projected
                },
                editable: editable
            };
            obj = wkt.toObject(config); // Make an object

            switch (obj.type) {
            case "point":
                symbol = new esri.symbol.SimpleMarkerSymbol(esri.symbol.SimpleMarkerSymbol.STYLE_SQUARE, 10, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([255, 0, 0]), 1), new dojo.Color([0, 255, 0, 0.25]));
                break;
            case "polyline":
                symbol = new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_DASH, new dojo.Color([255, 0, 0]), 1);
                break;
            case "polygon":
                symbol = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_DASHDOT, new dojo.Color([255, 0, 0]), 2), new dojo.Color([255, 255, 0, 0.25]));
                break;
            case "extent":
                symbol = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_DASHDOT, new dojo.Color([255, 0, 0]), 2), new dojo.Color([255, 255, 0, 0.25]));
                break;
            case "multipoint":
                symbol = new esri.symbol.SimpleMarkerSymbol(esri.symbol.SimpleMarkerSymbol.STYLE_DIAMOND, 20, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([0, 0, 0]), 1), new dojo.Color([255, 255, 0, 0.5]));
                break;
            }

            graphic = new esri.Graphic(obj, symbol);
            this.map.graphics.add(graphic); // Add to map
            this.map.setExtent(graphic.geometry.getExtent().expand(2));
            this.features.push(graphic); // Remember it for later
            return obj;
        },
        /**
         * Updates the textarea based on the first available feature.
         */
        updateText: function () {
            var wkt = new Wkt.Wkt();
            wkt.fromObject(this.features[0]);
            document.getElementById('wkt').value = wkt.write();
        },
        /**
         * Application entry point.
         * @return  {<L.map>} The Leaflet instance
         */
        init: function () {
            var map = new esri.Map('canvas', {
                //center: ['4533495.9425000027, -13589917.8221'],
                zoom: 2,
                basemap: 'topo'
            });
            // Set event handlers //////////////////////////////////////////////
            dojo.connect(map, 'onLoad', function () {
                //                document.getElementById('wkt').value = 'LINESTRING (-13589971.1109 4533495.9425000027, -13589966.918200001 4533489.8069000021, -13589966.8683 4533489.7331999987, -13589955.647300001 4533472.9825000018, -13589955.5357 4533472.8122000024, -13589946.1962 4533458.2133999988, -13589945.9586 4533457.8219999969, -13589945.9118 4533457.7397999987, -13589936.126899999 4533440.3281000033, -13589936.021 4533440.1345999986, -13589926.692499999 4533422.6105, -13589926.4555 4533422.1344000027, -13589917.9841 4533403.864699997, -13589917.8221 4533403.4954999983, -13589910.3638 4533385.4793, -13589910.2625 4533385.2246999964, -13589903.2716 4533366.884800002, -13589903.2161 4533366.7353999987, -13589903.0812 4533366.3359000012, -13589897.1032 4533347.2929999977, -13589897.0343 4533347.063500002, -13589895.687199999 4533342.368900001)';
            });
            return map;
        }
    };
}());
dojo.require('esri.map');
//dojo.addOnLoad(app.init); // Not necessary; see <body> tag