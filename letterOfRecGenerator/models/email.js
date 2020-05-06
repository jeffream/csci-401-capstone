var db = require('../db');
var Schema = db.Schema;

var EmailSchema = new Schema({
    title: String,
    subject: String,
    body_text: String,
});

EmailSchema.methods.getId = function () {
    return this._id;
};

EmailSchema.methods.getTitle = function () {
    return this.title;
};

EmailSchema.methods.getSubject = function () {
    return this.subject;
};

EmailSchema.methods.getBodyText = function () {
    return this.body_text;
};

var Email = db.model('Email', EmailSchema);

module.exports = Email;