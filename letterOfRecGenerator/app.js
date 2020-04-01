require('dotenv').config();

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// Passport Config
const passport = require('passport');
require('./config/passport');
//require('./config/passport')(passport); <-- similar line to above, see which one to use
//var LocalStrategy = require('passport-local').Strategy;

// Other variables
var session = require('express-session');
var {google} = require('googleapis');
var querystring = require('querystring');
var url = require('url');
var OAuth2 = google.auth.OAuth2;
const cors = require('cors');
const nodemailer = require('nodemailer');
var fileUpload = require('express-fileupload');
var mammoth = require('mammoth');
var opn = require('opn');
var downloadsFolder = require('downloads-folder');
var docx = require('docx');
var fs = require('fs');
var request = require('request');
const flash = require('connect-flash');
const jwt = require('jsonwebtoken');



var app = express();


// Set headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'Authorization');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});


// Middleware for authentication & express
app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ <-- see if replacing this function breaks anything
//     extended: true,
//     limit: '50mb'
// }));
app.use(bodyParser.urlencoded({
    extended: false,
}));
app.use(session({
    secret: 'anything',
    resave: true,
    saveUninitialized: false
}));


// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

//Connect Flash
app.use(flash());

//Global Vars
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
})


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.png')));

// file upload handler
app.use(fileUpload());


// Routes Variables
var createTemplate = require('./routes/template-editor');
var createEmailTemplate = require('./routes/email-template-editor');
var formCompleted = require('./routes/form-completed');
var formEntry = require('./routes/form-entry');
var index = require('./routes/login');
var letterPreview = require('./routes/letter-preview');
var recommenderDashboard = require('./routes/recommender-dashboard');
var templateDashboard = require('./routes/template-dashboard');
var users = require('./routes/users');
var history = require('./routes/history');
var archive = require('./routes/archive');
var response = require('./routes/response');
var emailLetterPreview = require('./routes/email-letter-preview');
var docxVar = require('./routes/docx');
var about = require('./routes/about');
var auth = require('./routes/auth');


// Routes
app.use('/', index);
app.use('/auth', auth);
app.use('/recommender-dashboard', isAuthenticated, recommenderDashboard);
app.use('/template-editor', isAuthenticated, createTemplate);
app.use('/email-template-editor',isAuthenticated, createEmailTemplate);
app.use('/form-completed', formCompleted);
app.use('/form-entry', formEntry);
app.use('/letter-preview', letterPreview);
app.use('/email-letter-preview', emailLetterPreview);
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

// logout handler
app.use('/logout', (req, res) => {
    req.logOut();
    res.redirect('/login');
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

// authenticate function
function isAuthenticated(req, res, next) {

  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  console.log('IN VERIFY: ', token)

  if(token == null) return res.sendStatus(401)

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) {
          console.log("error with token or secret entered");
          res.sendStatus(403);
      }
      req.user = user
      next()
  })
}


module.exports = app;
