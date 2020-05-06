var express = require('express');
var User = require('../models/user');
var router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const verify = require('./verifyToken');

router.use(function (req, res, next) {
    res.locals.userValue = null;
    next();
});


//Get Rec Dashboard page
router.get('/recommender-dashboard', verify, (req, res) =>

  // // Searching through session info to find User ID number
  // var sessionString = JSON.stringify(req.sessionStore.sessions);
  // var id_index = sessionString.search('id') + 7;
  // var id_index_lastNum = id_index + 24;
  // var userID = sessionString.slice(id_index, id_index_lastNum);
  //
  // User.findUser(userID, function (err, user) {
  //   if (err) {
  //     console.log('Error finding User.');
  //   } else {



      res.render('pages/recommender-dashboard' {
        req.user: user
      })
  //   }
  // });
);

//Get Temp Editor page and pass in user
router.get('/template-editor', ensureAuthenticated, (req, res) =>

  // // Searching through session info to find User ID number
  // var sessionString = JSON.stringify(req.sessionStore.sessions);
  // var id_index = sessionString.search('id') + 7;
  // var id_index_lastNum = id_index + 24;
  // var userID = sessionString.slice(id_index, id_index_lastNum);
  //
  // User.findUser(userID, function (err, user) {
  //   if (err) {
  //     console.log('Error finding User.');
  //   } else {

      res.render('pages/template-editor' {
        user: req.user
      })
  //   }
  // });
);


router.get('/template-dashboard', ensureAuthenticated, (req, res) =>

  // // Searching through session info to find User ID number
  // var sessionString = JSON.stringify(req.sessionStore.sessions);
  // var id_index = sessionString.search('id') + 7;
  // var id_index_lastNum = id_index + 24;
  // var userID = sessionString.slice(id_index, id_index_lastNum);
  //
  // User.findUser(userID, function (err, user) {
  //   if (err) {
  //     console.log('Error finding User.');
  //   } else {

      res.render('pages/template-dashboard' {
        user: req.user
      })
  //   }
  // });
);

router.post('/template-editor', ensureAuthenticated, (req, res) =>

  // // Searching through session info to find User ID number
  // var sessionString = JSON.stringify(req.sessionStore.sessions);
  // var id_index = sessionString.search('id') + 7;
  // var id_index_lastNum = id_index + 24;
  // var userID = sessionString.slice(id_index, id_index_lastNum);
  //
  // User.findUser(userID, function (err, user) {
  //   if (err) {
  //     console.log('Error finding User.');
  //   } else {

      res.render('pages/template-editor' {
        user: req.user
      })
  //   }
  // });
);


// Get Home Page
router.get('/', function (req, res, next) {
    res.render('pages/index', {
        title: 'Express',
        header: 'Add user'
    });
});

router.post('/', function (req, res) {
    var user = {
        name: {
            first: req.body.fname,
            last: req.body.lname
        }
    };
    User.createUser(user);
    res.render('pages/index', {
        title: 'Express',
        header: 'Add User',
        userValue: user.name,
        user: user
    });
});

module.exports = router;
