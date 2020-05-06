var express = require('express');
var router = express.Router();
var Form = require('../models/form');

/* GET form entry page. */
router.get('/:hash', function (req, res, next) {
    console.log(req.headers.host);
    Form.findFromLink(req.params.hash, function (err, form) {
        if (err) {
            res.send("Form not found.");
        } else {
            if (!form.meta.submitted) {
                res.render('pages/form-entry', {
                     title: 'Form: ' + form.getTemplate().getName() + ', created ' + form.getSent() + '.',
                    questions: form.getTemplate().getQuestions(),
                    form: form,
                });
            }
            else {
                res.render('pages/form-completed', {
                    title: 'FORM COMPLETED',
                });
            }
        }
    }); 
});

/**
 * From form-entry submitForm
 */
router.post('/', function (req, res, next) {

    console.log(req.body.id);
    var obj=[];
    var body = JSON.parse(req.body.responseData);
    obj.responseData=body;
    // console.log(obj); 
    // console.log(obj.responseData);
    // return;
    Form.submitForm(req.body.id, obj.responseData, function (err) {
        if (err) {
            res.send("unable to update responses of user form");
        } else {
            res.render('pages/form-completed', {
                title: 'FORM COMPLETED',
            });
        }
    });
});

module.exports = router;