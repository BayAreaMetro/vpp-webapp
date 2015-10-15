var express = require('express');
var router = express.Router();
var database = require('./database.js')
var mssql = require('mssql');
var github = require('octonode');
//Sendgrid library
var sendgrid = require('sendgrid')('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');
var moment = require('moment');

var client = github.client({
    username: 'MTCGIS',
    password: 'GIS@mtc101'
});

var ghme = client.me();
var ghuser = client.user('MetropolitanTransportationCommission');
var ghrepo = client.repo('MetropolitanTransportationCommission/vpp-webapp');
var ghorg = client.org('MetropolitanTransportationCommission');
var ghissue = client.issue('MetropolitanTransportationCommission/vpp-webapp', 37);
var ghmilestone = client.milestone('MetropolitanTransportationCommission/vpp-webapp', 37);
var ghlabel = client.label('MetropolitanTransportationCommission/vpp-webapp', 'Enhancement Request');
var ghpr = client.pr('MetropolitanTransportationCommission/vpp-webapp', 37);
var ghgist = client.gist();
var ghteam = client.team(37);
//var ghnotification = client.notification(37);

var ghsearch = client.search();

//Get Issues for Repo
ghrepo.issues(function(err, data, head) {
    //    console.log(err);
    //    console.log(data);
    //    console.log(head);
});

var sql;


router.use('/', database);




router.post('/submitfeedback', function(req, res, next) {
    var feedbackCategory = req.param('fc');
    var feedbackType = req.param('ft');
    var feedbackComment = req.param('fcomment');

    ghrepo.issue({
        "title": "Public Comment",
        "body": feedbackComment,
        //"assignee": "Keareys",
        //"milestone": 1,
        "labels": [feedbackCategory, feedbackType]
    }, function(err, success) {
        if (err) {
            console.log(err);
        }
        var response = [{
            'response': success
        }];

        res.json(response);

    }); //issue

});

//Submit contact form
router.post('/submitcontact', function(req, res, next) {
    console.log(req.body);
    console.log(req.body.email);
    var newdate = moment(new Date()).format('MMMM Do YYYY, h:mm:ss a');

    var email = new sendgrid.Email();
    email.addTo('ksmith@mtc.ca.gov');
    email.subject = "Contact Form Submission";
    email.setFrom(req.body.email);
    email.setFromName(req.body.name);
    email.replyto = req.body.email;
    email.html = req.body.name + " (" + req.body.email + ") sent the following comment on " + newdate + ": <br><br>" + req.body.comment;

    console.log('about to send email');

    sendgrid.send(email, function(err, json) {
        if (err) {
            console.log(err);
            var error = {
                "response": "error"
            };
            res.json(error);
        }
        console.log(json);
        var response = {
            "response": "success"
        };

        res.json(response);
    });

});



//Load Study Areas
router.get('/studyareas', function(req, res, next) {
    sql = new mssql.Request(database.connection);
    sql.query("select * from VPP_Data.StudyAreas_VW Order By Name", function(err, data) {
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
router.get('/collectionyear', function(req, res, next) {
    sql = new mssql.Request(database.connection);
    var sa = req.param('sa');
    sql.query("SELECT Project_ID, CollectionYear FROM VPP_Data.StudyAreas_VW where Project_ID=" + sa, function(err, data) {
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
router.get('/geninfo', function(req, res, next) {
    sql = new mssql.Request(database.connection);
    var sa = req.param('sa');
    sql.query("SELECT * FROM VPP_Data.StudyAreas_VW where Project_ID=" + sa, function(err, data) {
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
router.get('/summary', function(req, res, next) {
    sql = new mssql.Request(database.connection);
    var sa = req.param('sa');
    sql.query("select * From VPP_Data.Data_Summary where Project_ID=" + sa, function(err, data) {
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
router.get('/supplyboth', function(req, res, next) {
    sql = new mssql.Request(database.connection);
    var sa = req.param('sa');
    sql.query("SELECT * FROM VPP_Data.WEBMAP__InventorySummaryBoth where Project_ID=" + sa, function(err, data) {
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
router.get('/supplyoffstreet', function(req, res, next) {
    sql = new mssql.Request(database.connection);
    var sa = req.param('sa');
    sql.query("SELECT * FROM VPP_Data.WEBMAP__InventorySummaryOff where Project_ID=" + sa, function(err, data) {
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
router.get('/supplyonstreet', function(req, res, next) {
    sql = new mssql.Request(database.connection);
    var sa = req.param('sa');
    sql.query("SELECT * FROM VPP_Data.WEBMAP__InventorySummaryOn where Project_ID=" + sa, function(err, data) {
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

//Load Inventory for Download
router.get('/inventoryon', function(req, res, next) {
    sql = new mssql.Request(database.connection);
    var sa = req.param('sa');
    sql.query("SELECT * FROM VPP_Data.WEBMAP__InventoryDownloadON where Project_ID=" + sa, function(err, data) {
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
router.get('/inventoryoff', function(req, res, next) {
    sql = new mssql.Request(database.connection);
    var sa = req.param('sa');
    sql.query("SELECT * FROM VPP_Data.WEBMAP__InventoryDownloadOFF where Project_ID=" + sa, function(err, data) {
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
//Load Occupancy for Download
router.get('/occupancyon', function(req, res, next) {
    sql = new mssql.Request(database.connection);
    var sa = req.param('sa');
    sql.query("SELECT * FROM VPP_Data.WEBMAP__OccupancyDownloadON where Project_ID=" + sa, function(err, data) {
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
router.get('/occupancyoff', function(req, res, next) {
    sql = new mssql.Request(database.connection);
    var sa = req.param('sa');
    sql.query("SELECT * FROM VPP_Data.WEBMAP__OccupancyDownloadOFF where Project_ID=" + sa, function(err, data) {
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
//Return Peak VALUES
router.get('/getPeak', function(req, res, next) {
    sql = new mssql.Request(database.connection);
    var sa = req.param('sa');
    var pt = req.param('pt');
    sql.query("SELECT *  FROM VPP_Data.WEBMAP__PeakPeriod where Project_ID=" + sa + "and Peak_Type='" + pt + "'", function(err, data) {
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
//
//Load Occupancy Weekday (Needs Study Area Variable, )
router.get('/ocupancywd', function(req, res, next) {
    sql = new mssql.Request(database.connection);
    sql.query("select * From VPP_Data.WDOccupancy", function(err, data) {
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
router.get('/ocupancywe', function(req, res, next) {
    sql = new mssql.Request(database.connection);
    sql.query("", function(err, data) {
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
