var express = require('express');
var router = express.Router();
var db = require('../db')
var fs = require('fs')

/* GET About page. */
router.get('/', function (req, res, next) {

    res.render('pages/about', {
        title: 'About',
    });
});

module.exports = router;
