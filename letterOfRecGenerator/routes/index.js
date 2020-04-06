var express = require('express');
var User = require('../models/user');
var router = express.Router();
const verify = require('./verifyToken');

router.use(function (req, res, next) {
    res.locals.userValue = null;
    next();
});


//Get Rec Dashboard page
router.get('/recommender-dashboard', verify, function (req, res) {

  // get UserID
  var userID = req.user._id;

  User.findUser(userID, function (err, user) {
    if (err) {
      console.log('Error finding User.');
    } else {

        res.render('pages/recommender-dashboard' {
          req.user: user
        })
      }
    });
});

//Get Temp Editor page and pass in user
router.get('/template-editor', verify, function (req, res) {

  // get UserID
  var userID = req.user._id;

  User.findUser(userID, function (err, user) {
    if (err) {
      console.log('Error finding User.');
    } else {

      res.render('pages/template-editor' {
        user: req.user
      })
    }
  });
});


router.get('/template-dashboard', verify, function (req, res) {

  // get UserID
  var userID = req.user._id;

  User.findUser(userID, function (err, user) {
    if (err) {
      console.log('Error finding User.');
    } else {

      res.render('pages/template-dashboard' {
        user: req.user
      })
    }
  });
});

router.post('/template-editor', verify, function (req, res) {

  // get UserID
  var userID = req.user._id;

  User.findUser(userID, function (err, user) {
    if (err) {
      console.log('Error finding User.');
    } else {

      res.render('pages/template-editor' {
        user: req.user
      })
    }
  });
});


// // Get Home Page
// router.get('/', function (req, res, next) {
//     res.render('pages/index', {
//         title: 'Express',
//         header: 'Add user'
//     });
// });
//
// router.post('/', function (req, res) {
//     var user = {
//         name: {
//             first: req.body.fname,
//             last: req.body.lname
//         }
//     };
//     User.createUser(user);
//     res.render('pages/index', {
//         title: 'Express',
//         header: 'Add User',
//         userValue: user.name,
//         user: user
//     });
// });

module.exports = router;
