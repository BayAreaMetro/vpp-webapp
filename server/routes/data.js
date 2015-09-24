var express = require('express');
var router = express.Router();
var database = require('./database.js')
var mssql = require('mssql');

var sql;


router.use('/', database);

//Load Study Areas
router.get('/studyareas', function (req, res, next) {
    sql = new mssql.Request(database.connection);
    sql.query("select * from VPP_Data.StudyAreas_VW", function (err, data) {
        if (err) {
            res.writeHead(500, {
                'Content-Type': 'text/plain'
            });
            res.write("Got error :-( " + err);
            res.end("");
            return;
        }

        res.send(JSON.stringify(data));
        //console.log(data);
        //res.write(JSON.stringify(results, null, 4));
        res.end("; Done.");
    });
});

//Load Collection Year
router.get('/collectionyear', function (req, res, next) {
    sql = new mssql.Request(database.connection);
    var sa = req.param('sa');
    sql.query("SELECT Project_ID, CollectionYear FROM VPP_Data.StudyAreas_VW where Project_ID=" + sa, function (err, data) {
        if (err) {
            res.writeHead(500, {
                'Content-Type': 'text/plain'
            });
            res.write("Got error :-( " + err);
            res.end("");
            return;
        }

        res.send(JSON.stringify(data));
        //console.log(data);
        //res.write(JSON.stringify(results, null, 4));
        res.end("; Done.");
    });
});

//Load General Information
router.get('/geninfo', function (req, res, next) {
    sql = new mssql.Request(database.connection);
    var sa = req.param('sa');
    sql.query("SELECT * FROM VPP_Data.StudyAreas_VW where Project_ID=" + sa, function (err, data) {
        if (err) {
            res.writeHead(500, {
                'Content-Type': 'text/plain'
            });
            res.write("Got error :-( " + err);
            res.end("");
            return;
        }

        res.send(JSON.stringify(data));
        //console.log(data);
        //res.write(JSON.stringify(results, null, 4));
        res.end("; Done.");
    });
});

//Load Master Summary Data
router.get('/summary', function (req, res, next) {
    sql = new mssql.Request(database.connection);
    var sa = req.param('sa');
    sql.query("select * From VPP_Data.Data_Summary where Project_ID=" + sa, function (err, data) {
        if (err) {
            res.writeHead(500, {
                'Content-Type': 'text/plain'
            });
            res.write("Got error :-( " + err);
            res.end("");
            return;
        }

        res.send(JSON.stringify(data));
        //console.log(data);
        //res.write(JSON.stringify(results, null, 4));
        res.end("; Done.");
    });
});

//Load Parking Supply Information
router.get('/supplyboth', function (req, res, next) {
    sql = new mssql.Request(database.connection);
    var sa = req.param('sa');
    sql.query("SELECT * FROM VPP_Data.WEBMAP__InventorySummaryBoth where Project_ID=" + sa, function (err, data) {
        if (err) {
            res.writeHead(500, {
                'Content-Type': 'text/plain'
            });
            res.write("Got error :-( " + err);
            res.end("");
            return;
        }

        res.send(JSON.stringify(data));
        //console.log(data);
        //res.write(JSON.stringify(results, null, 4));
        res.end("; Done.");
    });
});
router.get('/supplyoffstreet', function (req, res, next) {
    sql = new mssql.Request(database.connection);
    var sa = req.param('sa');
    sql.query("SELECT * FROM VPP_Data.WEBMAP__InventorySummaryOff where Project_ID=" + sa, function (err, data) {
        if (err) {
            res.writeHead(500, {
                'Content-Type': 'text/plain'
            });
            res.write("Got error :-( " + err);
            res.end("");
            return;
        }

        res.send(JSON.stringify(data));
        //console.log(data);
        //res.write(JSON.stringify(results, null, 4));
        res.end("; Done.");
    });
});
router.get('/supplyonstreet', function (req, res, next) {
    sql = new mssql.Request(database.connection);
    var sa = req.param('sa');
    sql.query("SELECT * FROM VPP_Data.WEBMAP__InventorySummaryOn where Project_ID=" + sa, function (err, data) {
        if (err) {
            res.writeHead(500, {
                'Content-Type': 'text/plain'
            });
            res.write("Got error :-( " + err);
            res.end("");
            return;
        }

        res.send(JSON.stringify(data));
        //console.log(data);
        //res.write(JSON.stringify(results, null, 4));
        res.end("; Done.");
    });
});

//Load Inventory
router.get('/inventoryon', function (req, res, next) {
    sql = new mssql.Request(database.connection);
    var sa = req.param('sa');
    //var pt = req.param('pt');
    //var cy = req.param('cy');
    sql.query("SELECT * FROM WEBMAP__InventoryDownloadON where Project_ID=" + sa, function (err, data) {
        if (err) {
            res.writeHead(500, {
                'Content-Type': 'text/plain'
            });
            res.write("Got error :-( " + err);
            res.end("");
            return;
        }

        res.send(JSON.stringify(data));
        //console.log(data);
        //res.write(JSON.stringify(results, null, 4));
        res.end("; Done.");
    });
});
router.get('/inventoryoff', function (req, res, next) {
    sql = new mssql.Request(database.connection);
    var sa = req.param('sa');
    //var pt = req.param('pt');
    //var cy = req.param('cy');
    sql.query("SELECT * FROM WEBMAP__InventoryDownloadOFF where Project_ID=" + sa, function (err, data) {
        if (err) {
            res.writeHead(500, {
                'Content-Type': 'text/plain'
            });
            res.write("Got error :-( " + err);
            res.end("");
            return;
        }

        res.send(JSON.stringify(data));
        //console.log(data);
        //res.write(JSON.stringify(results, null, 4));
        res.end("; Done.");
    });
});


//Load Occupancy Weekday (Needs Study Area Variable, )
router.get('/ocupancywd', function (req, res, next) {
    sql = new mssql.Request(database.connection);
    sql.query("select * From VPP_Data.WDOccupancy", function (err, data) {
        if (err) {
            res.writeHead(500, {
                'Content-Type': 'text/plain'
            });
            res.write("Got error :-( " + err);
            res.end("");
            return;
        }

        res.send(JSON.stringify(data));
        //console.log(data);
        //res.write(JSON.stringify(results, null, 4));
        res.end("; Done.");
    });
});

//Load Occupancy Weekend (Needs Study Area Variable, )
router.get('/ocupancywe', function (req, res, next) {
    sql = new mssql.Request(database.connection);
    sql.query("", function (err, data) {
        if (err) {
            res.writeHead(500, {
                'Content-Type': 'text/plain'
            });
            res.write("Got error :-( " + err);
            res.end("");
            return;
        }

        res.send(JSON.stringify(data));
        //console.log(data);
        //res.write(JSON.stringify(results, null, 4));
        res.end("; Done.");
    });
});


module.exports = router;