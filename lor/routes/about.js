var express = require('express');
var router = express.Router();
var db = require('../db')
var fs = require('fs')
const verify = require('./verifyToken');

/* GET About page. */
router.get('/', verify, function (req, res, next) {

    res.render('pages/about', {
        title: 'About',
    });
});

module.exports = router;
