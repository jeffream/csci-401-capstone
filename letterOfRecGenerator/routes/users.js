const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

// User model
const User = require('../models/User');

//Login Page
router.get('/login', (req, res) => res.render('login'));

//Register Page
router.get('/register', (req, res) => res.render('register'));

// Rec Dashboard page
router.get('/recommender-dashboard', (req, res) => res.render('recommender-dashboard'));

// Register handle
router.post('/register', (req, res) => {
  const { name, email, password, password2 } = req.body;
  let errors = [];

  // Check required fields
  if(!name || !email || !password || !password2) {
    errors.push({ msg: 'Please fill in all fields' });
  }

  // Check passwords match
  if(password !== password2) {
    errors.push({ msg: 'Passwords do not match' });
  }

  // Check pass length
  if(password.length < 6) {
    errors.push({ msg: 'Password should be at least 6 characters' });
  }

  if(errors.length > 0) {
    res.render('register', {
      errors,
      name,
      email,
      password,
      password2
    });
  } else {
    // Validation passed
    User.findOne({ email: email })
      .then(user => {
        if(user) {
          //User exists
          errors.push({ msg: 'Email is already registered' });
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
            password
          });

          // Hash Passwords
          bcrypt.genSalt(10, (err, salt) =>
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if(err) throw err;
              // Set password to hashed
              newUser.password = hash;
              // Save User
              newUser.save()
                .then(user => {
                  req.flash('success_msg', 'You are now registered and can log in');
                  res.redirect('/users/login');
                })
                .catch(err => console.log(err));
          }))
        }
      });
  }

});

<<<<<<< HEAD
<<<<<<< HEAD
// Login handle
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard',
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
=======
=======
>>>>>>> parent of ae7cd2e... potentially finish login with authentication, needs testing
/* GET users listing. */
// router.get('/', function (req, res, next) {
//     User.find(function (err, results) {
//         if (err) {
//             res.send("Oops...");
//         } else {
//             res.send(results);
//         }
//     });
// });
<<<<<<< HEAD
>>>>>>> parent of ae7cd2e... potentially finish login with authentication, needs testing
=======
>>>>>>> parent of ae7cd2e... potentially finish login with authentication, needs testing

module.exports = router;
