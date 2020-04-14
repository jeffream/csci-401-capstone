var express = require('express');
var User = require('../models/user');

var router = express.Router();

router.get('/', function (req, res, next) {

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

        if (req.query.id) {
            templateName = req.user.getEmailTemplate(req.query.id).title;
            subject = req.user.getEmailTemplate(req.query.id).subject;
            body = req.user.getEmailTemplate(req.query.id).body_text;

            res.render('pages/email-template-editor', {
                title: 'EDIT TEMPLATE',
                templateName: templateName,
                templates: user.getEmailTemplates(),
                id: req.query.id,
                subject: subject,
                body: body,
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
        } else {
                res.render('pages/email-template-editor', {
                    title: 'EDIT TEMPLATE',
                    templateName: req.query.title,
                    templates: req.user.getEmailTemplates(),
                    id: req.query.id,
                    subject: null,
                    body: null,
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
    //   }
    // });
});

router.post('/addEmailTemplate', function (req, res, next) {

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

      req.user.addEmailTemplate(req.body.Email, function (err, id) {
          if (err) {
              console.log(err);
          } else {
              res.json({
                  success: "Created Successfully",
                  status: 200,
                  id:id
              });
          }
      });
  //   }
  // });
});

router.get('/edit', function (req, res, next) {

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

      if (req.query.id) {
          var templateName = req.user.getEmailTemplate(req.query.id).getTitle();
          var subject = req.user.getEmailTemplate(req.query.id).getSubject();
          var body = req.user.getEmailTemplate(req.query.id).getBodyText();
          res.json({
              title: 'EDIT AN EMAIL TEMPLATE',
              templateName: templateName,
              subject: subject,
              body: body,
              id: req.query.id,
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
        } else {
            res.json({
                title: null,
                id: null,
            });
        }
  //     }
  // });
});

router.post('/update', function (req, res, next) {

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

      req.user.updateEmailTemplate(req.body.id, req.body.Email, function (err) {
          if (err) {
              console.log(err);
          } else {
              res.json({
                  success: "Updated Successfully",
                  status: 200
              });
          }
      });
  //   }
  // });
});



module.exports = router;
