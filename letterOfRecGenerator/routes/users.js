var express = require('express');
var User = require('../models/user');
var router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');


/* GET users listing. */
router.get('/', function (req, res, next) {
    User.find(function (err, results) {
        if (err) {
            res.send("Oops...");
        } else {
            res.send(results);
        }
    });
});

// Get Register page
router.get('/register', (req, res) => res.render('register'));

// Get Login page
router.get('/login', (req, res) => res.render('login'));

//Register handle
router.post('/register', (req, res) => {
  const { name, email, password, password2 } = req.body;
  const linkTemplate_body = 'Please click the following questionnaire ';
  const linkTemplate_subject = 'Invitation to Fill Recommendation Letter Questionnaire';

  let errors = [];

  if (!name || !email || !password || !password2) {
    errors.push({ msg: 'Please enter all fields' });
  }

  if (password != password2) {
    errors.push({ msg: 'Passwords do not match' });
  }

  if (password.length < 6) {
    errors.push({ msg: 'Password must be at least 6 characters' });
  }

  if (errors.length > 0) {
    res.render('register', {
      errors,
      name,
      email,
      password,
      password2
    });
  } else {
    // Validation passes
    User.findOne({ email: email }).then(user => {
      if (user) {
        errors.push({ msg: 'Email already exists' });
        res.render('register', {
          errors,
          name,
          email,
          password,
          password2
        });
      } else {
        const newUser = new User({
          name,
          email,
          password,
          linkTemplate_subject,
          linkTemplate_body
        });

        console.log(newUser)

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(user => {
                req.flash(
                  'success_msg',
                  'You are now registered and can log in'
                );
                res.redirect('/users/login');
              })
              .catch(err => console.log(err));
          });
        });
      }
    });
  }
});

// Login handle
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/recommender-dashboard',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
});

// Logout handle
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/users/login');
});

module.exports = router;
