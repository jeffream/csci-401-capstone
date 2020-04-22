var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Form = require('../models/form');
const verify = require('./verifyToken');

router.get('/', verify, function (req, res, next) {

  // find User ID
  var userID = req.user._id;

  User.findUser(userID, function (err, user) {
    if (err) {
      console.log('Error finding User.');
    } else {

      user.getDeactivatedForms( function (err, deactivatedForms) {
          if (err) {
              console.log(err);
          } else {
              res.render('pages/archive', {
                  title: 'Archive',
                  forms: deactivatedForms,
                  emailtemplates: user.getDeactivatedEmailTemplates(),
                  templates: user.getDeactivatedTemplates(),
              });
          }
      });
    }
  });
});

router.post('/restore-template', verify, function (req, res, next) {

  // find User ID
  var userID = req.user._id;

  User.findUser(userID, function (err, user) {
    if (err) {
      console.log('Error finding User.');
    } else {
        user.activateTemplate(req.body.id, function (err) {
            if (err) {
                console.log(err);
            } else {
                user.getDeactivatedForms( function (err, deactivatedForms) {
                    if (err) {
                        console.log(err);
                    } else {
                        res.render('pages/archive', {
                            title: 'Archive Page',
                            forms: deactivatedForms,
                            emailtemplates: user.getDeactivatedEmailTemplates(),
                            templates: user.getDeactivatedTemplates(),
                        });
                    }
                });
            }
        });
      }
    });
});

router.post('/restore-email-template', verify, function (req, res, next) {

  // find User ID
  var userID = req.user._id;

  User.findUser(userID, function (err, user) {
    if (err) {
      console.log('Error finding User.');
    } else {
      user.activateEmailTemplate(req.body.id, function (err) {
          if (err) {
              console.log(err);
          } else {
              user.getDeactivatedForms( function (err, deactivatedForms) {
                  if (err) {
                      console.log(err);
                  } else {
                      res.render('pages/archive', {
                          title: 'Archive Page',
                          forms: deactivatedForms,
                          emailtemplates: user.getDeactivatedEmailTemplates(),
                          templates: user.getDeactivatedTemplates(),
                      });
                  }
              });
          }
        });
      }
  });
});

module.exports = router;
