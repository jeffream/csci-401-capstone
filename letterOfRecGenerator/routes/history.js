var express = require('express');
var router = express.Router();
var Form = require('../models/form');
var User = require('../models/user');
const verify = require('./verifyToken');


/* GET Templates page. */
router.get('/', verify, function (req, res, next) {

  // get UserID
  var userID = req.user._id;

  User.findUser(userID, function (err, user) {
    if (err) {
      console.log('Error finding User.');
    } else {
      res.render('pages/history', {
          title: req.query.email,
          emailHistory: user.getEmailHistory(),
          id: req.query.id,
      });
    }
  });
});

module.exports = router;
