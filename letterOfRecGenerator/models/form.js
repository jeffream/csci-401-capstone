var db = require('../db');
var Link = require('./link');
var User = require('./user');
var Template = require('./template');
var Email = require('./email');

var Schema = db.Schema;

var FormSchema = new Schema({
    email: String,
    status: {
        type: String,
        enum: ['Sent', 'Submitted', 'Complete']
    },
    email_sent: Boolean,
    emailhistory: [Email.schema],
    template: Template.schema,
    link: Link.schema,
    responses: [{
        tag: String,
        response: Schema.Types.Mixed,
    }],
    meta: {
        sent: Date,
        submitted: Date,
        completed: Date
    },
    letter: String,
    duplicated: Boolean,
    organization: String,
    owner: {type: db.Schema.Types.ObjectId, ref: 'User'}
});


FormSchema.methods.getResponses = function () {
    return this.responses;
};

/**
 * Creates a new form and initializes values
 * @param email Students email address
 * @param template
 * @param cb
 */
FormSchema.statics.createForm = function (email, template, userId, cb) {
    Link.generateLink(email, function (err, link) {
        if (err) {
            cb(err, null);
        } else {
            Form.create({
                email: email,
                status: 'Sent',
                email_sent: false,
                template: template,
                link: link,
                'meta.sent': Date.now(),
                duplicated: false,
                organization: "unspecified",
                owner: userId
            }, cb);
        }
    });
};

FormSchema.statics.findForm = function (id, cb) {
    Form.findOne({_id: id}, cb);
};

FormSchema.statics.findFromLink = function (link, cb) {
    Form.findOne({'link.link': link}, cb);
};

/* Removes form from database. However, we do not use this
because we deactivate forms, not remove them */
FormSchema.statics.removeForm = function (id, cb) {
    FormSchema.statics.findForm(id, function (err, form) {
        if (err) {
            cb(err, null);
        } else {
            Link.removeLink(form.link.getId(), function (err) {
                if (err) {
                    cb(err, null);
                } else {
                    Form.remove({_id: id}, cb);
                }
            });
        }
    });
};

FormSchema.methods.getLink = function () {
    return this.link.link;
};

FormSchema.methods.getSent = function () {
    return this.meta.sent.toLocaleString('en-US');
};

FormSchema.methods.isSubmitted = function () {
    return this.status == 'Submitted';
};

FormSchema.methods.getSubmitted = function () {
    return this.meta.submitted.toLocaleString('en-US');
};

FormSchema.methods.getTemplate = function () {
    return this.template;
};

/**
 * Setter for organization
 * @param organization
 */
FormSchema.methods.setOrganization = function (organization) {
    this.organization = organization;
    this.save();
};

/**
 * Happens when student submits his/her response. 
 * Receives the response, updates the response in the form,
 * check if there are multiple organizations, and if there are,
 * create duplicates with seperate organization names and 
 * add the form._id to the correct owner (user).
 * @param id - id of form
 * @param responseData - responseData collected from the submitted response
 * @param cb
 */
FormSchema.statics.submitForm = function (id, responseData, cb) {
    var organizationArr = [];
    var savedFormIdArr = [];
    var totalForms = 1;
    let fieldsByForm = [];
    var customQuestionFound = false;

    FormSchema.statics.findForm(id, function (err, form) {
        if (err) {
            cb("error in FormSchema.statics.submitForm / .findForm " + err, null);
        } else {
            var responses = [];

            form['template']['questions'].forEach(function (question) {  
    
                var response = responseData[question.number - 1];
                /* If the question has a organizationFlag that is true, 
                attempt to extract the organizations (seperated with , )
                and make additional Forms with the different organization names */
                //If response is empty
                if (!response || !response.length) {
                    responses.push({
                        tag: question.tag,
                        response: ''
                    });
                }
                else if (question.type === "Radio Button" || question.type === "Text") {
                    responses.push({
                        tag: question.tag,
                        response: response[0]
                    });
                } else if (question.type === "Custom") { // custom
                        customQuestionFound = true;
                        let questionOptions = question.options;

                        let allFields = [];
                        for (let i = 0; i < questionOptions.length; i++) {
                            let field = {
                                fieldName: questionOptions[i].option, // University
                                fieldTag: questionOptions[i].tag // <!Uni>
                            };
                            allFields.push(field);
                        }

                        // num organizations = len / number of options
                        let numResponse = response.length;
                        let numOptions = questionOptions.length;
                        let numOrganizations = numResponse / numOptions;
                        totalForms = numOrganizations;

                        for (let k = 0; k < numOrganizations; k++) {
                            fieldsByForm[k] = {
                                num: k,
                                fields: [] // 
                            };
                        }

                        let i = 0;
                        response.forEach(function (optionText) {
                            // i can be calculated -- hack-y
                            let formIndex = Math.floor(i / numOptions);
                            let optionIndex = i % numOptions;
                            let field = {
                                fieldName: allFields[optionIndex].fieldName,
                                fieldTag: allFields[optionIndex].fieldTag,
                                response: optionText
                            };
                            fieldsByForm[formIndex].fields.push(field);
                            i++;
                        });

                        if(fieldsByForm.length){
                            let allFieldsInForm = fieldsByForm[0].fields;
                            // For the 0th form, push in parsed fields from custom question
                            for(let k=0; k<allFieldsInForm.length; k++) {
                                responses.push({
                                    tag: allFieldsInForm[k].fieldTag,
                                    response: allFieldsInForm[k].response
                                }); 
                            }
                        }
                } else { // checkbox (?)
                    response.forEach(function (optionText) {
                        var option = question.options.find(function (option) {
                            return option.fill === optionText;
                        });

                        responses.push({
                            tag: option.tag, // can't read property tag of undefined
                            response: option.fill // can;t read porperty fill of undefined
                        });
                    });
                }
            }); // for each question

            // Finished going through each question

            // set responses form 0th
            if(customQuestionFound){
                form.organization = fieldsByForm[0].fields[0].response; // fields[0] shoudl always correspond to <!ORG>
            }
            form.duplicated = true;
            form.status = 'Submitted';

            form['meta']['submitted'] = Date.now();

            form['responses'] = responses;
            form.save().then(function (savedForm) {
                // if there is more than one organization, then duplicate form
                    // for each other org, duplicate the form
                    for (let orgIndex = 1; orgIndex < totalForms; orgIndex++) {
                        /* Here we create duplicate forms and then add the form._id to the 
                        owner of the original form, which is the user. */
                        var promise = Form.create({
                            email: savedForm.email,
                            status: savedForm.status,
                            email_sent: savedForm.email_sent,
                            template: savedForm.template,
                            link: savedForm.link,
                            responses: savedForm.responses,
                            meta: savedForm.meta,
                            letter: savedForm.letter,
                            duplicated: true,
                            organization: fieldsByForm[orgIndex].fields[0].response,
                            owner: savedForm.owner
                        });

                        // for each orgIndex, push remaining here
                        promise.then(function (savedForm) {
                            savedFormIdArr.push(savedForm._id);
                            /* We update the response for organization to the right ones here */
                            FormSchema.statics.findForm(savedForm._id, function (err, foundForm) {
                                if (err) {
                                    console.log("error finding saved Form");
                                } else {
                                    let duplicateResponse = foundForm['responses'];

                                    // setting correct tags, take in account for custom q
                                    if (fieldsByForm.length) {
                                        let allFieldsInForm = fieldsByForm[orgIndex].fields;
                                        for (let j = 0; j < duplicateResponse.length; j++) {
                                            for (let k = 0; k < allFieldsInForm.length; k++) {
                                                if (duplicateResponse[j].tag === allFieldsInForm[k].fieldTag) {
                                                    duplicateResponse[j].response = allFieldsInForm[k].response;
                                                }
                                            }  
                                        }
                                    }

                                    foundForm.responses = duplicateResponse;
                                    foundForm.save();
                                }
                            });
                        }, function (rejected) {
                            console.log("rejected promise: " + rejected);
                        });
                    } // for each form



                //Adding form._id to user (who is the owner of the original form)
                db.model('User').findOne({_id: form.owner}).populate('forms').exec( function(err, user) {
                    if(err) {
                        console.log("error in form User.findOne");
                    } else {
                        if(savedFormIdArr.length > 0){
                            for(let i=0; i < savedFormIdArr.length; i++) {
                                user.forms.push(savedFormIdArr[i]);                            
                            }
                            user.save();
                        }
                    }
                });
            }, function(err) {
                console.log("promise error: " + err);
            });  
        }
        cb(err);
    });
};

FormSchema.statics.setEmailSent = function (id, cb) {
    FormSchema.statics.findForm(id, function (err, form) {
        if (err) {
            cb(err, null);
        } else {
            form.email_sent = true;
            form.save(function (err) {
                cb(err, form);
            });
        }
    });
}

FormSchema.statics.completeForm = function (id, letter, cb) {
    FormSchema.statics.findForm(id, function (err, form) {
        if (err) {
            cb(err, null);
        } else {
            form.letter = letter;
            form.status = 'Complete';

            if (!form['meta']['completed']) {
                form['meta']['completed'] = Date.now();
            }

            form.save(function (err) {
                cb(err, form);
            });
        }
    });
};

FormSchema.methods.addEmailHistory_Form = function (email, cb) {
    this.emailhistory.push(email);
    var newTemplate = this.emailhistory[this.emailhistory.length - 1];
    this.save(function (err, id) {
        cb(err, newTemplate.getId());
    })    
};

FormSchema.methods.getFormattedQuestions = function (id, cb) {


    var formattedQuestions = [];
    this.template.questions.forEach(function (question) {
        if (question.type === "Radio Button" || question.type === "Text") {  
            formattedQuestions.push({tag: question.tag, question: question.question});
        } else if (question.type === "Custom") { // custom
                var customQuestion = question.question;
                for(let i = 0; i < question.options.length; i++) {
                    customQuestion += " | ";
                    customQuestion += question.options[i].option;
                    formattedQuestions.push({tag: question.options[i].tag, question: customQuestion})
                    customQuestion = question.question; //Reupdate to original question
                }  
        } else { // checkbox
            var checkboxQuestion = question.question;
            for(let i = 0; i < question.options.length; i++) {
                checkboxQuestion += " | ";
                checkboxQuestion += question.options[i].option;
                formattedQuestions.push({tag: question.options[i].tag, question: checkboxQuestion});
                checkboxQuestion = question.question; //Reupdate to original question
            }
        }
    });
    return formattedQuestions;
}

FormSchema.methods.updateResponse = function (editedResponses) {
    for(i=0; i < this.responses.length; i++) {
        this.responses[i].response = editedResponses[i];
    }
    this.save();
}

var Form = db.model('Form', FormSchema);

module.exports = Form;