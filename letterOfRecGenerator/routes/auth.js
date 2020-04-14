require('dotenv').config();

const express = require('express');
const router  = express.Router();
const jwt = require('jsonwebtoken');
const passport = require('passport');
var User = require('../models/user');
const bcrypt = require('bcryptjs');


// Get Login page
router.get('/login', (req, res) => res.render('login'));

// Get Register page
router.get('/register', (req, res) => res.render('register'));

/* POST login. */
router.post('/login', function (req, res, next) {

  // Authenticate User
    passport.authenticate('local', {
      session: false
    }, (err, user, info) => {
        if (err || !user) {
            return res.status(400).json({
                message: info ? info.message : 'Login failed',
                user: user
            });
        }
        // console.log(user);
        req.login(user, {session: false}, (err) => {
            if (err) {
                res.send(err);
            }
            console.log('In login: ', process.env.ACCESS_TOKEN_SECRET);
            const token = jwt.sign(user.toJSON(), process.env.ACCESS_TOKEN_SECRET);
            req.session.token = token;
            // res.set({
            //   'Authorization': token
            // });
            // res.header()
            // res.setHeader()
            res.redirect('../recommender-dashboard');
        });
    })
    (req, res);
});

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
          linkTemplate_body,
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
                res.redirect('/auth/login');
              })
              .catch(err => console.log(err));
          });
        });
      }
    });
  }
});

// Logout handle
router.get('/logout', (req, res) => {
  req.logOut();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/auth/login');
});

module.exports = router;
