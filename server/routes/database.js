var express = require('express');
var router = express.Router();

//MSQL SERVER
var mssql = require('mssql');

//MSQL SERVER CONFIGURATION
router.configSQL = {
    user: 'VPP_Data',
    password: 'GIS@vppdata101',
    server: 'gisdb2.c4ttzt2cz0de.us-west-2.rds.amazonaws.com',
    database: 'VPP_Web_GeoDB'

};

router.connection = new mssql.Connection(router.configSQL, function (err) {
    if (err)
        console.log(err);
});

module.exports = router;