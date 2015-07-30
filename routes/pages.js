'use strict';  

var express = require('express');
var router = express.Router();


//MIDDLEWARE
//Check if user is logged in. If yes, proceed to page that they requests. Otherwise, redirect to home page
function isloggedIn(req, res, next) {
    if (req.user) {
        console.log(req.user);
        next();
    } else {
        res.redirect('/');
    }
}



/////////////////////////////////
//
// DEFINE BASIC PAGES
//
////////////////////////////////



//Define Index Page with authentication parameter
router.get('/', function (req, res) {
    res.render('pages/index');
});



module.exports = router;