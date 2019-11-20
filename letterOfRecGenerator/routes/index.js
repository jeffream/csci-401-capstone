var express = require('express');
var User = require('../models/user');
var router = express.Router();

router.use(function (req, res, next) {
    res.locals.userValue = null;
    next();
});

/* GET home page. */
router.get('/', function (req, res, next) {
    // res.render('pages/index', {
    //     title: 'Express',
    //     header: 'Add user'
    // });
    res.render('pages/login', {
        title: 'Letter of Recommendation Generator',
        subtitle: '',
        url: 'recommender-dashboard'
    });
});

router.post('/', function (req, res) {
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
                return res.render('pages/recommender-dashboard', {
                    title: 'Express',
                    header: 'Add User',
                    userValue: user.name
                });
            }
        });
    }

    // var user = {
    //     name: {
    //         first: req.body.fname,
    //         last: req.body.lname
    //     }
    // };
    //
    // User.createUser(user);
    //
    // res.render('pages/index', {
    //     title: 'Express',
    //     header: 'Add User',
    //     userValue: user.name
    // });
});

module.exports = router;
