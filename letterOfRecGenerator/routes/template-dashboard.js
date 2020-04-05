var express = require('express');
var router = express.Router();
var db = require('../db')
var fs = require('fs')
var User = require('../models/user');
const verify = require('./verifyToken');

/* GET Templates page. */
router.get('/', verify, function (req, res, next) {
    var currLetterTemplate = __dirname + '/uploads/' + 'letterTemplate';
    if(!fs.existsSync(currLetterTemplate)){
        currLetterTemplate = '';
    }

    res.render('pages/template-dashboard', {
        title: 'Templates',
        templates: req.user.templates,
        emailtemplates: req.user.emailTemplates,
        letterTemplate: currLetterTemplate
    });
});

router.post('/delete', verify, function (req, res, next) {

  // get UserID
  var userID = req.user._id;

  User.findUser(userID, function (err, user) {
    if (err) {
      console.log('Error finding User.');
    } else {
      user.deactivateTemplate(req.body.id, function (err) {
          if (err) {
              console.log(err);
          } else {
              res.render('pages/template-dashboard', {
                  title: 'Templates',
                  templates: user.getTemplates(),
                  emailtemplates: user.getEmailTemplates(),
              });
          }
      });
    }
  });
});

router.post('/delete-email', verify, function (req, res, next) {

  // get UserID
  var userID = req.user._id;

  User.findUser(userID, function (err, user) {
    if (err) {
      console.log('Error finding User.');
    } else {

    user.deactivateEmailTemplate(req.body.id, function (err) {
        if (err) {
            console.log(err);
        } else {
            res.render('pages/template-dashboard', {
                title: 'Templates',
                templates: user.getTemplates(),
                emailtemplates: user.getEmailTemplates(),
            });
          }
      });
    }
  });
});

router.post('/uploadLetterTemplate', verify, function(req,res,next){
    console.log(req.files.file);
    // console.log(req)
    var file = req.files.file;

    var filePath = __dirname + '/uploads/' + 'letterTemplate';
    file.mv(filePath, function(err){
        if(err){
            return res.status(500).send(err);
        }
    });

    console.log("about to print file;");
    console.log(file);

})

module.exports = router;
