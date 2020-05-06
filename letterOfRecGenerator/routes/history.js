var express = require('express');
var router = express.Router();
var Form = require('../models/form');
//var User = require('../models/user');
const verify = require('./verifyToken');


/* GET Templates page. */
router.get('/', verify, function (req, res, next) {

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
  //
      res.render('pages/history', {
          title: req.query.email,
          emailHistory: req.user.getEmailHistory(),
          id: req.query.id,
      });
  //   }
  // });
});

module.exports = router;
