var express = require('express');
var app = express();
var router = express.Router();
var nodemailer = require('nodemailer');
var Form = require('../models/form');
var Link = require('../models/link');
var credentials = require('../config/auth');
var googleAuth = require('google-auth-library');
var {google} = require('googleapis');
var OAuth2 = google.auth.OAuth2;
const fs = require('fs');
var Docxtemplater = require('docxtemplater');
var DocxMerger = require('docx-merger');
var Readable = require('stream').Readable;
var path = require('path');
var builder = require('docx-builder');
var docx = new builder.Document();
var dt = require('./letter-parser');
var User = require('../models/user');

const verify = require('./verifyToken');

"use strict";

router.use(function (req, res, next) {
    res.locals.statusMessage = null;
    next();
});

/**
 * data needed to render recommender-dashboard
 */
router.get('/', verify, function (req, res, next) {

  // get UserID
  var userID = req.user._id;
  User.findUser(userID, function (err, user) {
    if (err) {
      console.log('Error finding User.');
    } else {
      //console.log(userID);
      // console.log(user);
      user.getForms(userID,function (err, forms) {
          if (err) {
              console.log(`error: ${err}`);
          } else { 

            var temp = user.getTemplates();

              res.render('pages/recommender-dashboard', {
                  title: user._id,
                  templates: user.getTemplates(),
                  forms: forms,
                  subject: user.getLinkTemplateSubject(),
                  body: user.getLinkTemplateBody()
              });
          }
      });
    }
  });
});

router.post('/', verify, async function (req, res, next) {

  // get User ID
  var userID = req.user._id;

  User.findUser(userID, async function (err, user) {
    if (err) {
      console.log('Error finding User.');
    } else {

      var currentUser = user;
      var userId = currentUser._id;
      var subject = req.body.subject_text;
      var toEmail = req.body.email;
      var body = req.body.body_text;

      if (!toEmail.length) {
          res.render('pages/recommender-dashboard', {
              title: 'Recommendations',
              statusMessage: 'Please provide a valid email'
          });
          return;
      }

      Form.createForm(toEmail, user.getTemplate(req.body.templateId), userId, async function (err, form) {
        if (err) {
            console.log(`error: ${err}`);
        } else {
            user.addForm(form, function (err) {
                if (err) {
                    console.log(`error: ${err}`);
                    return;
                }
            });

        var url = encodeURI('http://localhost:8085/form-entry/' + form.getLink());

        // create reusable transporter object using the default SMTP transport
        let transporter = await nodemailer.createTransport({
          service: "gmail", 
          host: "smtp.gmail.com", 
          auth: {
              user: "testdemotest11@gmail.com",
              pass: "testeresfera.11"
          }
        });

        // setup email data with unicode symbols
        let mailOptions = {
            from: '"Letter of Rec Generator" <letterofrecgenerator@gmail.com>', // sender address
            to: req.body.email, // list of receivers
            subject: req.body.subject_text, // Subject line
            text: req.body.body_text + ' ' + url, // plain text body
            html: '<p>' + req.body.body_text + ' ' + url + '</p>'// html body
        };

        // send mail with defined transport object
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log('Message sent: %s', info.messageId);
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

            res.render('contact', {msg:'Email has been sent'});
        });

        res.redirect('/recommender-dashboard');
        }
      });
    }
  });
});


router.post('/delete', verify, function (req, res, next) {

  var userID = req.user._id;

  User.findUser(userID, function (err, user) {
    if (err) {
      console.log('Error finding User.');
    } else {

      user.removeForm(req.body.id, function (err) {
          if (err) {
              console.log(err);
          } else {
              user.getForms(function (err, forms) {
                  if (err) {
                      console.log(`error: ${err}`);
                  } else {
                      res.render('pages/recommender-dashboard', {
                          title: 'Welcome ' + user.displayName + '!',
                          templates: user.getTemplates(),
                          forms: forms,
                      });
                  }
              });
          }
      });
    }
  });
});

router.post('/update', verify, function (req, res, next) {

  var userID = req.user._id;

  User.findUser(userID, function (err, user) {
    if (err) {
      console.log('Error finding User.');
    } else {

      user.update_linkTemplate_subject(req.body.subject, function (err) {
          if (err) {
              console.log("error in update_linkTemplate_subject: " + err);
              res.send(err);
          } else {
              user.update_linkTemplate_body(req.body.body, function (err) {
                  if (err) {
                      console.log("error in update_linkTemplate_body: " + err);
                      res.send(err);
                  } else {
                      res.json({
                          success: "Updated Successfully",
                          status: 200
                      });
                  }
              });
          }
      });
    }
  });
});

module.exports = router;
