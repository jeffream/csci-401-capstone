require('dotenv').config();

const express = require('express');
const router  = express.Router();

const jwt = require('jsonwebtoken');
const passport = require('passport');


// Get Register page
router.get('/register', (req, res) => res.render('register'));

// Get Login page
router.get('/login', (req, res) => res.render('login'));


/* POST login. */
router.post('/login', function (req, res, next) {

  // Authenticate User
    passport.authenticate('local', {
      session: false
    }, (err, user, info) => {
        console.log('is there an error: ', err);
        if (err || !user) {
            return res.status(400).json({
                message: info ? info.message : 'Login failed',
                user: user
            });
        }

        req.login(user, {session: false}, (err) => {
            if (err) {
                res.send(err);
            }
            console.log('In login: ', process.env.ACCESS_TOKEN_SECRET);
            const token = jwt.sign(user.toJSON(), process.env.ACCESS_TOKEN_SECRET);
            res.setHeader('Authorization', 'Bearer ' + token);
        });
    })
    (req, res);
});

// Logout handle
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/auth/login');
});

module.exports = router;
