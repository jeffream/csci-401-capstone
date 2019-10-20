var express = require('express');
var User = require('../models/user');
var Form = require('../models/form');

var router = express.Router();

router.get('/', function (req, res, next) {
    var questions =  [];
    req.user.getForm(req.query.id, function (err, form) {
        if(err) {
            console.log(err)
        } else {
            questions = form.getFormattedQuestions();
            res.render('pages/response', {
                title: 'Received Responses for ' + form.email,
                id: req.query.id,
                questions: questions,
                responses: form.getResponses(),
            });
        }
    });

});

router.get('/update', function (req, res, next) {
    var questions =  [];
    var formId = req.query.id;
    var editedResponses = req.query.editedResponses;
    req.user.getForm(formId, function (err, form) {
        if(err) {
            console.log(err)
        } else {
            form.updateResponse(editedResponses);
            res.json({
                success: "Created Successfully",
                status: 200
            });
        }
    });

});


module.exports = router;