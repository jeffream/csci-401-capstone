var crypto = require('crypto');
var db = require('../db');

var Schema = db.Schema;

var LinkSchema = new Schema({
    link: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

LinkSchema.statics.generateLink = function (email, cb) {
    var hash = crypto.createHash('md5').update(email + Date.now().toString()).digest("hex");

    Link.create({link: hash}, cb);
};

LinkSchema.statics.removeLink = function (id, cb) {
    Link.remove({_id: id}, cb);
};

LinkSchema.methods.getId = function() {
    return this._id;
}

var Link = db.model('Link', LinkSchema);

module.exports = Link;