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

    var temps = req.user.templates;
    var temp = temps[0];

    console.log('TEMP Dash IS: ', temp);

    res.render('pages/template-dashboard', {
        title: 'Templates',
        templates: req.user.templates,
        emailtemplates: req.user.emailTemplates,
        letterTemplate: currLetterTemplate
    });
});

router.post('/delete', verify, function (req, res, next) {

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

      req.user.deactivateTemplate(req.body.id, function (err) {
          if (err) {
              console.log(err);
          } else {
              res.render('pages/template-dashboard', {
                  title: 'Templates',
                  templates: req.user.getTemplates(),
                  emailtemplates: req.user.getEmailTemplates(),
              });
          }
      });
  //   }
  // });
});

router.post('/delete-email', verify, function (req, res, next) {

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

    req.user.deactivateEmailTemplate(req.body.id, function (err) {
        if (err) {
            console.log(err);
        } else {
            res.render('pages/template-dashboard', {
                title: 'Templates',
                templates: req.user.getTemplates(),
                emailtemplates: req.user.getEmailTemplates(),
            });
          }
      });
  //   }
  // });
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
