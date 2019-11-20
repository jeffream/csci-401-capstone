var express = require('express');
var User = require('../models/user');

var router = express.Router();

router.get('/', function (req, res, next) {
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
                questions: questions
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
                questions: questions
            });
        }

    } else {
        res.render('pages/template-editor', {
            title: 'CREATE A NEW TEMPLATE',
            templateName: req.query.title,
            id: null,
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
    req.user.addTemplate(req.body.template, function (err, id) {
        if (err) {
            if(err.message == "DUPLICATE NAME") {
                console.log("error is duplicate name");
                res.status(500).send({error: 'Duplicate Name'});
            }
        } else {
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
