var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

var mongoDB = 'mongodb://128.125.100.147:12345/test';
mongoose.connect(mongoDB);

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

module.exports = mongoose;
