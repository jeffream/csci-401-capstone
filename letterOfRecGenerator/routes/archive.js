var express = require('express');
var router = express.Router();
//var User = require('../models/user');
var Form = require('../models/form');
const verify = require('./verifyToken');

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

      req.user.getDeactivatedForms( function (err, deactivatedForms) {
          if (err) {
              console.log(err);
          } else {
              res.render('pages/archive', {
                  title: 'Archive',
                  forms: deactivatedForms,
                  emailtemplates: req.user.getDeactivatedEmailTemplates(),
                  templates: req.user.getDeactivatedTemplates(),
              });
          }
      });
  //   }
  // });
});

router.post('/restore-template', function (req, res, next) {

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

        req.user.activateTemplate(req.body.id, function (err) {
            if (err) {
                console.log(err);
            } else {
                req.user.getDeactivatedForms( function (err, deactivatedForms) {
                    if (err) {
                        console.log(err);
                    } else {
                        res.render('pages/archive', {
                            title: 'Archive Page',
                            forms: deactivatedForms,
                            emailtemplates: req.user.getDeactivatedEmailTemplates(),
                            templates: req.user.getDeactivatedTemplates(),
                        });
                    }
                });
            }
        });
    //   }
    // });
});

router.post('/restore-email-template', function (req, res, next) {

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


      req.user.activateEmailTemplate(req.body.id, function (err) {
          if (err) {
              console.log(err);
          } else {
              req.user.getDeactivatedForms( function (err, deactivatedForms) {
                  if (err) {
                      console.log(err);
                  } else {
                      res.render('pages/archive', {
                          title: 'Archive Page',
                          forms: deactivatedForms,
                          emailtemplates: req.user.getDeactivatedEmailTemplates(),
                          templates: req.user.getDeactivatedTemplates(),
                      });
                  }
              });
          }
        });
  //     }
  // });
});

module.exports = router;
