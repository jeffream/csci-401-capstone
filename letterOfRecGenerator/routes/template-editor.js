var express = require('express');
var User = require('../models/user');
var passport = require('passport');
const verify = require('./verifyToken');

var router = express.Router();

router.get('/', verify, function (req, res, next) {

  // get UserID
  var userID = req.user._id;

  User.findUser(userID, function (err, user) {
    if (err) {
      console.log('Error finding User.');
    } else {

      var letterheadImg;
      var footerImg;
      var saveStatus = req.query.saveSwitch;
      var questions;
      if (req.query.id) {
          if(saveStatus=="true"){
              letterheadImg = user.getTemplate(req.query.id).letterheadImg;
              footerImg = user.getTemplate(req.query.id).footerImg;
              questions = user.getTemplate(req.query.id).getQuestions();
              res.render('pages/template-editor', {
                  title: 'EDITING TEMPLATE',
                  templateName: req.query.title,
                  id: req.query.id,
                  letterheadImage: letterheadImg,
                  footerImage: footerImg,
                  saveSwitch: req.query.saveSwitch,
                  questions: questions,
                  user: req.user
              });
          } else {
              letterheadImg = user.getDeactivatedTemplate(req.query.id).letterheadImg;
              footerImg = user.getDeactivatedTemplate(req.query.id).footerImg;
              questions = user.getDeactivatedTemplate(req.query.id).getQuestions();
              res.render('pages/template-editor', {
                  title: 'VIEWING ARCHIVED TEMPLATE',
                  templateName: req.query.title,
                  id: req.query.id,
                  letterheadImage: letterheadImg,
                  footerImage: footerImg,
                  saveSwitch: req.query.saveSwitch,
                  questions: questions,
                  user: req.user
              });
          }

      } else {
          res.render('pages/template-editor', {
              title: 'CREATE A NEW TEMPLATE',
              templateName: req.query.title,
              id: null,
              user: req.user,
              letterheadImage: null,
              footerImage: null,
              saveSwitch: true,
              questions: [{ question: "What is your first name?",
                            tag: "<!FNAME>"},
                          { question: "What is your last name?",
                            tag: "<!LNAME>"},
                          { question: "What is your preferred personal pronoun (subject)?",
                            tag: "<!SUB_PRONOUN>"},
                          { question: "What is your preferred personal pronoun (object)",
                            tag: "<!OBJ_PRONOUN>"},
                          { question: "What is your preferred possessive pronoun?",
                            tag: "<!POS_PRONOUN>"},
                          { question: "What organizations are you applying to?",
                            tag: "<!ORG>"}]
          });
        }
      }
    });
});

router.get('/edit', verify, function (req, res, next) {

  // get UserID
  var userID = req.user._id;

  User.findUser(userID, function (err, user) {
    if (err) {
      console.log('Error finding User.');
    } else {

      if (req.query.id) {
          var templateName = user.getTemplate(req.query.id).getName();
          var questions = user.getTemplate(req.query.id).getQuestions();
          res.json({
              title: templateName,
              id: req.query.id,
              saveSwitch: true,
              questions: questions
          });
      } else {
          res.json({
              title: null,
              id: null,
              saveSwitch: true,
              questions: [{ question: "What is your first name?",
                              tag: "<!FNAME>"},
                          { question: "What is your last name?",
                              tag: "<!LNAME>"},
                          { question: "What is your preferred personal pronoun (subject)?",
                              tag: "<!SUB_PRONOUN>"},
                          { question: "What is your preferred personal pronoun (object)",
                              tag: "<!OBJ_PRONOUN>"},
                          { question: "What is your preferred possessive pronoun?",
                              tag: "<!POS_PRONOUN>"},
                          { question: "What organizations are you applying to?",
                              tag: "<!ORG>"}]
          });
        }
      }
  });
});

router.get('/deactivated-edit', verify, function (req, res, next) {

  // get UserID
  var userID = req.user._id;

  User.findUser(userID, function (err, user) {
    if (err) {
      console.log('Error finding User.');
    } else {

      if (req.query.id) {
          var templateName = user.getDeactivatedTemplate(req.query.id).getName();
          var questions = user.getDeactivatedTemplate(req.query.id).getQuestions();
          res.json({
              title: templateName,
              id: req.query.id,
              saveSwitch: false,
              questions: questions
          });
      } else {
          res.json({
              title: null,
              id: null,
              saveSwitch: false,
              questions: [{ question: "What is your first name?",
                              tag: "<!FNAME>"},
                          { question: "What is your last name?",
                              tag: "<!LNAME>"},
                          { question: "What is your preferred personal pronoun (subject)?",
                              tag: "<!SUB_PRONOUN>"},
                          { question: "What is your preferred personal pronoun (object)",
                              tag: "<!OBJ_PRONOUN>"},
                          { question: "What is your preferred possessive pronoun?",
                              tag: "<!POS_PRONOUN>"},
                          { question: "What organizations are you applying to?",
                              tag: "<!ORG>"}]
          });
      }
    }
  });
});

router.get('/template', verify, function (req, res, next) {

  // get UserID
  var userID = req.user._id;

  User.findUser(userID, function (err, user) {
    if (err) {
      console.log('Error finding User.');
    } else {

      if(req.query.saveSwitchData == "true") {
          res.json({
              letter: user.getTemplate(req.query.id).getText(),
              questions: user.getTemplate(req.query.id).getQuestions(),
              letterheadImg: user.getTemplate(req.query.id).getLetterheadImg(),
              footerImg: user.getTemplate(req.query.id).getFooterImg(),
              saveSwitch: req.query.saveSwitchData,
              questions: user.getTemplate(req.query.id).getQuestions()
          });
      } else {
          res.json({
              letter: user.getDeactivatedTemplate(req.query.id).getText(),
              questions: user.getDeactivatedTemplate(req.query.id).getQuestions(),
              letterheadImg: user.getDeactivatedTemplate(req.query.id).getLetterheadImg(),
              footerImg: user.getDeactivatedTemplate(req.query.id).getFooterImg(),
              saveSwitch: req.query.saveSwitchData,
              questions: user.getDeactivatedTemplate(req.query.id).getQuestions()
          });
      }
    }
  });
});

router.post('/fileUpload', verify, function (req,res, next) {
    console.log(req.files.file);
    var file = req.files.file;
    var headerPathP = __dirname + '/uploads/' + 'uploaded.pdf';
    file.mv(headerPathP, function(err) {
        if (err)
          return res.status(500).send(err);

    });

})

router.post('/create', verify, function (req, res, next) {

  // get UserID
  var userID = req.user._id;

  User.findUser(userID, function (err, user) {
    if (err) {
      console.log('Error finding User.');
    } else {

      console.log('BODY IS: ', typeof(req.body));

      var body = JSON.parse(req.body);
      console.log('NEW BODY IS: ', body);

      user.addTemplate(req.body.template, function (err, id) {
          console.log("IN ADD TEMPLATE");
          if (err) {
              if(err.message == "DUPLICATE NAME") {
                  console.log("error is duplicate name");
                  res.status(500).send({error: 'Duplicate Name'});
              }
          } else {
            console.log('Successful')
              res.json({
                  success: "Created Successfully",
                  status: 200,
                  id: id
              });
          }
        });
      }
  });
});

router.post('/update', verify, function (req, res, next) {

  // get UserID
  var userID = req.user._id;

  User.findUser(userID, function (err, user) {
    if (err) {
      console.log('Error finding User.');
    } else {
      console.log('Got em! (in RD): ', user.email);

      user.updateTemplate(req.body.id, req.body.template, function (err, template) {
          if (err) {
              console.log(err);
          } else {
              res.json({
                  success: "Updated Successfully",
                  status: 200
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

    console.log("about to print file");
    console.log(file);

})

module.exports = router;
