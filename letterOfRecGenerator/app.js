var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var {google} = require('googleapis');
var querystring = require('querystring');
var url = require('url');
var OAuth2 = google.auth.OAuth2;

const passport = require('passport');

// Passport Config
require('./config/passport')(passport);

//Email stuff
//const exphbs = require('express-handlebars');
const nodemailer = require('nodemailer');

var fileUpload = require('express-fileupload');
var mammoth = require('mammoth');
var opn = require('opn');
var downloadsFolder = require('downloads-folder');
var docx = require('docx');
var fs = require('fs');
var request = require('request');
const flash = require('connect-flash');

var createTemplate = require('./routes/template-editor');
var createEmailTemplate = require('./routes/email-template-editor');
var formCompleted = require('./routes/form-completed');
var formEntry = require('./routes/form-entry');
var index = require('./routes/login');
var letterPreview = require('./routes/letter-preview');
var login = require('./routes/login');
var recommenderDashboard = require('./routes/recommender-dashboard');
var templateDashboard = require('./routes/template-dashboard');
var users = require('./routes/users');
var history = require('./routes/history');
var archive = require('./routes/archive');
var response = require('./routes/response');
var emailLetterPreview = require('./routes/email-letter-preview');
var docxVar = require('./routes/docx');
var about = require('./routes/about');


var app = express();

// Middleware for authentication & express
app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true,
    limit: '50mb'
}));
app.use(session({
    secret: 'anything',
    resave: true,
    saveUninitialized: false
}));

//Connect Flash
app.use(flash());

//Global Vars
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
})

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());
app.use(fileUpload());

// view engine setup

//app.use(expressLayouts);
//app.engine('handlebars', exphbs());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.png')));



// go to google auth login
// app.get('/auth/google', passport.authenticate('google', {
//     scope: ['profile', 'https://www.googleapis.com/auth/gmail.send'],
//     prompt: 'select_account'
// }));

// send to rec dashboard if login succeeds
// app.get('/auth/google/callback', passport.authenticate('google', {failureRedirect: '/login'}), function (req, res) {
//     // Successful authentication, redirect home.
//     res.redirect('/recommender-dashboard');
// });

app.use('/logout', (req, res) => {
    req.logOut();
    res.redirect('/login');
});

// Routes
app.use('/', index);
app.use('/users', users);
app.use('/template-editor', isAuthenticated, createTemplate);
app.use('/email-template-editor',isAuthenticated, createEmailTemplate);
app.use('/form-completed', formCompleted);
app.use('/form-entry', formEntry);
app.use('/letter-preview', letterPreview);
app.use('/email-letter-preview', emailLetterPreview);
app.use('/login', login);
app.use('/recommender-dashboard', isAuthenticated, recommenderDashboard);
app.use('/template-dashboard', isAuthenticated, templateDashboard);
app.use('/history', history);
app.use('/archive', archive);
app.use('/response', response);
app.use('/docx', docxVar);
app.use('/about', isAuthenticated, about);



// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    console.log(err);
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('pages/error');
});

function isAuthenticated(req, res, next) {
    if (req.user) {
        return next();
    }

    res.redirect('/login');
}


module.exports = app;
