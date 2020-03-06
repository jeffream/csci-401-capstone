//var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
//var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
//var auth = require('./auth');

// Load User model
var User = require('../models/user');

module.exports = function(passport) {
  passport.use(
    new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
      // Match user
      User.findOne({
        email: email
      }).then(user => {
        if (!user) {
          return done(null, false, { message: 'That email is not registered' });
        }

        // Match password
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) throw err;
          if (isMatch) {
            return done(null, user);
          } else {
            return done(null, false, { message: 'Password incorrect' });
          }
        });
      });
    })
  );

// OLD code
// function extractProfile(profile) {
//     return {
//         id: profile.id,
//         displayName: profile.displayName,
//     };
// }
  passport.serializeUser(function(user, done) {
    done(null, user);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });
};

// Similar, but OLD code
// passport.deserializeUser(function (id, done) {
//     User.findUser(id, function (err, user) {
//         done(err, user);
//     });
// });


// OLD - Google Auth Strategy
// passport.use(new GoogleStrategy({
//     clientID: auth.clientId,
//     clientSecret: auth.clientSecret,
//     callbackURL: auth.clientCallback
// }, function (token, refreshToken, profile, done) {
//     process.nextTick(function () {
//
//         // Find the user based on their google id
//         var details = extractProfile(profile);
//         User.findOrCreate(details.id, function (err, user) {
//             if (err) {
//                 done(err, null);
//             }
//
//             user.displayName = details.displayName;
//             user.accessToken = token;
//             user.save();
//             done(null, user);
//         });
//     });
//

//module.exports = passport;
