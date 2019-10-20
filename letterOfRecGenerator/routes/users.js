var express = require('express');
var User = require('../models/user');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
    User.find(function (err, results) {
        if (err) {
            res.send("Oops...");
        } else {
            res.send(results);
        }
    });
});

module.exports = router;
