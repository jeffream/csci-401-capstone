var express = require('express');
var User = require('../models/user');

var router = express.Router();

router.get('/', function (req, res, next) {


  console.log('TE / ')
  console.log(req.user)

    var letterheadImg;
    var footerImg;
    var saveStatus = req.query.saveSwitch;
    var questions;
    if (req.query.id) {
        if(saveStatus=="true"){
            letterheadImg = req.user.getTemplate(req.query.id).letterheadImg;
            footerImg = req.user.getTemplate(req.query.id).footerImg;
            questions = req.user.getTemplate(req.query.id).getQuestions();
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
            letterheadImg = req.user.getDeactivatedTemplate(req.query.id).letterheadImg;
            footerImg = req.user.getDeactivatedTemplate(req.query.id).footerImg;
            questions = req.user.getDeactivatedTemplate(req.query.id).getQuestions();
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
});

router.get('/edit', function (req, res, next) {
    if (req.query.id) {
        var templateName = req.user.getTemplate(req.query.id).getName();
        var questions = req.user.getTemplate(req.query.id).getQuestions();
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
});

router.get('/deactivated-edit', function (req, res, next) {
    if (req.query.id) {
        var templateName = req.user.getDeactivatedTemplate(req.query.id).getName();
        var questions = req.user.getDeactivatedTemplate(req.query.id).getQuestions();
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
});

router.get('/template', function (req, res, next) {
    if(req.query.saveSwitchData == "true") {
        res.json({
            letter: req.user.getTemplate(req.query.id).getText(),
            questions: req.user.getTemplate(req.query.id).getQuestions(),
            letterheadImg: req.user.getTemplate(req.query.id).getLetterheadImg(),
            footerImg: req.user.getTemplate(req.query.id).getFooterImg(),
            saveSwitch: req.query.saveSwitchData,
            questions: req.user.getTemplate(req.query.id).getQuestions()
        });
    } else {
        res.json({
            letter: req.user.getDeactivatedTemplate(req.query.id).getText(),
            questions: req.user.getDeactivatedTemplate(req.query.id).getQuestions(),
            letterheadImg: req.user.getDeactivatedTemplate(req.query.id).getLetterheadImg(),
            footerImg: req.user.getDeactivatedTemplate(req.query.id).getFooterImg(),
            saveSwitch: req.query.saveSwitchData,
            questions: req.user.getDeactivatedTemplate(req.query.id).getQuestions()
        });
    }

});

router.post('/fileUpload', function (req,res, next) {
    console.log(req.files.file);
    var file = req.files.file;
    var headerPathP = __dirname + '/uploads/' + 'uploaded.pdf';
    file.mv(headerPathP, function(err) {
        if (err)
          return res.status(500).send(err);

    });

})

router.post('/create', function (req, res, next) {

    console.log('in create route');
    // console.log('Req body is: ', req.body);
    // console.log('User is: ', req.user);
    // console.log('Req session is: ', req.session);
    // console.log('Req is: ', req);

    //id =
    console.log('Session Store: ', req.sessionStore);
    //console.log('Memory Store: ', req.sessionStore.MemoryStore);
    console.log('Sessions Passport: ', req.sessionStore.sessions.passport);
    console.log('Sessions Passport 2: ', req.sessionStore.sessions['passport']);
    console.log('Sessions Passport 3: ', req.session['passport']);


    User.findById(id, function(err, user) {
      req.user = user;
    });

    req.user.addTemplate(req.body.template, function (err, id) {
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
});

router.post('/update', function (req, res, next) {
    req.user.updateTemplate(req.body.id, req.body.template, function (err, template) {
        if (err) {
            console.log(err);
        } else {
            res.json({
                success: "Updated Successfully",
                status: 200
            });
        }
    });
});

router.post('/uploadLetterTemplate', function(req,res,next){
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
