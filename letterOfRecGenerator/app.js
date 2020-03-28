const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const app = express();
const User = require('./models/user');

mongoose.connect('mongodb://127.0.0.1:27017/passport-jwt', { useMongoClient : true });
mongoose.connection.on('error', error => console.log(error) );
mongoose.Promise = global.Promise;

require('./config/auth');
hi

app.use( bodyParser.urlencoded({ extended : false }) );

const routes = require('./routes/routes');
const secureRoute = require('./routes/secure-routes');

app.use('/', routes);
//We plugin our jwt strategy as a middleware so only verified users can access this route
app.use('/user', passport.authenticate('jwt', { session : false }), secureRoute );

//Handle errors
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.json({ error : err });
});

app.listen(3000, () => {
  console.log('Server started')
});




//**** OLD CODE BELOW ****

// const express = require('express');
// var path = require('path');
// var favicon = require('serve-favicon');
// var logger = require('morgan');
// var cookieParser = require('cookie-parser');
// var bodyParser = require('body-parser');
// var session = require('express-session');
// var {google} = require('googleapis');
// var querystring = require('querystring');
// var url = require('url');
// var OAuth2 = google.auth.OAuth2;
//
// var LocalStrategy = require('passport-local').Strategy;
//
// const passport = require('passport');
//
// // Passport Config
// require('./config/passport')(passport);
//
// //Email stuff
// //const exphbs = require('express-handlebars');
// const nodemailer = require('nodemailer');
//
//
// var fileUpload = require('express-fileupload');
// var mammoth = require('mammoth');
// var opn = require('opn');
// var downloadsFolder = require('downloads-folder');
// var docx = require('docx');
// var fs = require('fs');
// var request = require('request');
// const flash = require('connect-flash');
//
// var app = express();
//
// // handle CORS policy
// // app.options('*', cors());
// // app.use(cors());
//
// // Add headers for CORS
// app.use(function (req, res, next) {
//
//     // Website you wish to allow to connect
//     res.setHeader('Access-Control-Allow-Origin', '*');
//
//     // Request methods you wish to allow
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
//
//     // Request headers you wish to allow
//     res.setHeader('Access-Control-Allow-Headers', 'Authorization');
//
//     // Set to true if you need the website to include cookies in the requests sent
//     // to the API (e.g. in case you use sessions)
//     res.setHeader('Access-Control-Allow-Credentials', true);
//
//     // Pass to next layer of middleware
//     next();
// });
//
//
// var createTemplate = require('./routes/template-editor');
// var createEmailTemplate = require('./routes/email-template-editor');
// var formCompleted = require('./routes/form-completed');
// var formEntry = require('./routes/form-entry');
// var index = require('./routes/login');
// var letterPreview = require('./routes/letter-preview');
// var login = require('./routes/login');
// var recommenderDashboard = require('./routes/recommender-dashboard');
// var templateDashboard = require('./routes/template-dashboard');
// var users = require('./routes/users');
// var history = require('./routes/history');
// var archive = require('./routes/archive');
// var response = require('./routes/response');
// var emailLetterPreview = require('./routes/email-letter-preview');
// var docxVar = require('./routes/docx');
// var about = require('./routes/about');
//
//
// // Middleware for authentication & express
// app.use(logger('common'));
// app.use(express.static(path.join(__dirname, 'public')));
// app.use(cookieParser());
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({
//     extended: true,
//     limit: '50mb'
// }));
// app.use(session({
//     secret: 'anything',
//     resave: true,
//     saveUninitialized: false
// }));
//
// //Connect Flash
// app.use(flash());
//
// //Global Vars
// app.use((req, res, next) => {
//   res.locals.success_msg = req.flash('success_msg');
//   res.locals.error_msg = req.flash('error_msg');
//   res.locals.error = req.flash('error');
//   next();
// })
//
// // Passport middleware
// app.use(passport.initialize());
// app.use(passport.session());
//
// app.use(fileUpload());
//
//
// // view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'ejs');
//
// // uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.png')));
//
//
//
// // go to google auth login
// // app.get('/auth/google', passport.authenticate('google', {
// //     scope: ['profile', 'https://www.googleapis.com/auth/gmail.send'],
// //     prompt: 'select_account'
// // }));
//
// // send to rec dashboard if login succeeds
// // app.get('/auth/google/callback', passport.authenticate('google', {failureRedirect: '/login'}), function (req, res) {
// //     // Successful authentication, redirect home.
// //     res.redirect('/recommender-dashboard');
// // });
//
// app.use('/logout', (req, res) => {
//     req.logOut();
//     res.redirect('/login');
// });
//
// // Routes
// app.use('/', index);
// app.use('/users', users);
// app.use('/template-editor', isAuthenticated, createTemplate);
// app.use('/email-template-editor',isAuthenticated, createEmailTemplate);
// app.use('/form-completed', formCompleted);
// app.use('/form-entry', formEntry);
// app.use('/letter-preview', letterPreview);
// app.use('/email-letter-preview', emailLetterPreview);
// app.use('/login', login);
// app.use('/recommender-dashboard', isAuthenticated, recommenderDashboard);
// app.use('/template-dashboard', isAuthenticated, templateDashboard);
// app.use('/history', history);
// app.use('/archive', archive);
// app.use('/response', response);
// app.use('/docx', docxVar);
// app.use('/about', isAuthenticated, about);
//
//
//
// // catch 404 and forward to error handler
// app.use(function (req, res, next) {
//     var err = new Error('Not Found');
//     err.status = 404;
//     next(err);
// });
//
//
//
//
// // error handler
// app.use(function (err, req, res, next) {
//     // set locals, only providing error in development
//     console.log(err);
//     res.locals.message = err.message;
//     res.locals.error = req.app.get('env') === 'development' ? err : {};
//
//     // render the error page
//     res.status(err.status || 500);
//     res.render('pages/error');
// });
//
//
// function isAuthenticated(req, res, next) {
//     if (req.user) {
//         return next();
//     }
//     return next(); // added this to test
//     res.redirect('/login');
// }
//
//
// module.exports = app;
