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
                responses: form.getResponses()
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
            form.letter = parseLetter(form);
            for (i = 0; i < form.responses.length; i++) {
                if (form.responses[i].tag == "<!ORG>") {
                    form.organization = form.responses[i].response;
                }
            }
            res.json({
                success: "Created Successfully",
                status: 200
            });
        }
    });
});

function parseLetter(form) {
    var tagRegex = /\<\![a-z0-9_]+\>/ig;
    var letter = form.template.text;
    var letter_html = decodeLetterHTML(letter);

    var responses = form.responses;

    var noCapitalization = Array.from(letter_html.replace(tagRegex, function (match) {
        var response = responses.find(function (item) {
            return item.tag.localeCompare(match, {sensitivity: 'base'}) == 0;
        });
        return response ? response.response : '';
    }).replace(tagRegex, function (match) {
        var response = responses.find(function (item) {
            return item.tag.localeCompare(match, {sensitivity: 'base'}) == 0;
        });
        return response ? response.response : '';
    }));

    for (var i = 0; i < noCapitalization.length; i++) {

        // Found ending punctuation that isn't the last letter in the text
        if ((noCapitalization[i] == '.' || noCapitalization[i] == '?' || noCapitalization[i] == '!') && i != noCapitalization.length - 1) {

            // Make sure exclamation point is not from a tag
            if (noCapitalization[i] == '!' && i > 0 && noCapitalization[i - 1] == '<') {
                continue;
            }

            // Look for the next alphabetical character to capitalize
            var j = i + 1;
            while (!((noCapitalization[j] >= 'a' && noCapitalization[j] <= 'z') || (noCapitalization[j] >= 'A' && noCapitalization[j] <= 'Z')) && j < noCapitalization.length) {
                j++;
            }

            // Found character to capitalize
            if (j < noCapitalization.length) {
                noCapitalization[j] = noCapitalization[j].toUpperCase();
            }
        }
    }

    return encodeLetterHTML(noCapitalization.join(""));
}

function decodeLetterHTML(text) {
    text = text.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, "\"").replace(/&#039;/g, "'").replace(/\<span class\="tag"\>/gi, '').replace(/\<\/span\>/gi, '').replace(/\<div\>/gi, '\n').replace(/\<\/div\>/gi, '').replace(/\<br\>/gi, '\n').replace(/\&nbsp;/g, ' ');
    text = text.replace(/\<strong\>\<\!/gi, "<!").replace(/\<\/strong\>/gi, '');
    text = text.replace(/\<strong\>/gi, '');
    return text;
}

function encodeLetterHTML(text) {
    text = text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;").replace(/\n/gi, '<br>');
    return text;
}


module.exports = router;
