var express = require('express');
var router = express.Router();
var User = require('../models/user.js')

/* GET login page. */
router.get('/', function (req, res, next) {
    res.render('pages/login', {
        title: 'Letter of Recommendation Generator',
        subtitle: '',
        url: 'recommender-dashboard'
    });
});

router.post('/', function (req, res, next) {
    if (req.body.email && req.body.password && req.body.passwordConf) {
        var userData = {
            email: req.body.email,
            password: req.body.password,
        }

        //use schema.create to insert data into the db
        User.createUser(userData, function (err, user) {
            if (err) {
                return next(err)
            } else {
                return res.render('pages/recommender-dashboard');
            }
        });
    }
});

module.exports = router;
