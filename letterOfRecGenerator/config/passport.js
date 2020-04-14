const passport = require('passport');
const passportJWT = require("passport-jwt");

const ExtractJWT = passportJWT.ExtractJwt;

const LocalStrategy = require('passport-local').Strategy;
const JWTStrategy   = passportJWT.Strategy;
const User = require('../models/user');
const bcrypt = require('bcryptjs');

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

// passport.use(new JWTStrategy({
//       jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
//       secretOrKey: 'jwt_secret'
//     },
//     function (jwtPayload, cb) {
//
//     //find the user in db if needed
//     return User.findOneById(jwtPayload.id)
//         .then(user => {
//             return cb(null, user);
//         })
//         .catch(err => {
//             return cb(err);
//         });
//     }
// ));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});


// OLDDDDD
// const bcrypt = require('bcryptjs');
// //var auth = require('./auth');
// var jwtSecret = require('jwtConfig');
//
// const BCRYPT_SALT_ROUNDS = 12;
//
// const passport = require('passport'),
//   LocalStrategy = require('passport-local').Strategy,
//   User = require('../models/user'),
//   JWTstrategy = require('passport-jwt').Strategy,
//   ExtractJWT = require('passport-jwt').ExtractJWT;
//
// passport.use(
//   'register',
//   new LocalStrategy({
//     usernameField: 'email',
//     passwordField: 'password',
//     session: false,
//   }, (email, password, done) => {
//       try {
//         User.findOne({
//           where: {
//             email: email,
//           },
//         }).then(user => {
//           if(user) {
//             console.log('username already taken');
//             return done(null, false, { message: 'username already taken'});
//           } else {
//             bcrypt.hash(password, BCRYPT_SALT_ROUNDS).then(hashedPassword => {
//               User.create({email, password: hashedPassword }).then(user => {
//                 console.log('user created');
//                 user.username = email;
//                 return done(null, user);
//               });
//             });
//           }
//         });
//       } catch (err) {
//         done(err);
//       }
//     },
//   ),
// );
//
// passport.use(
//   'login',
//   new LocalStrategy({
//     usernameField: 'email',
//     passwordField: 'password',
//     session: false,
//   }, (email, password, done) => {
//       try {
//         User.findOne({
//           where: {
//             email: email,
//           },
//         }).then(user => {
//           if(!user) {
//             console.log('cannot find username');
//             return done(null, false, { message: 'cannot find username'});
//           } else {
//             bcrypt.compare(password, user.password).then(response => {
//               if(response == false) {
//                 console.log('passwords do not match');
//                 return done(null, false, { message: 'passwords do not match' });
//               }
//               console.log('user found & authenticated');
//               return done(null, user);
//             });
//           }
//         });
//       } catch (err) {
//         done(err);
//       }
//     },
//   ),
// );
//
// // const opts = {
// //   jwtFromRequest: ExtractJWT.fromAuthHeaderWithScheme('JWT'),
// //   secretOrKey: jwtSecret.secret,
// // };
// //
// // passport.use(
// //   'jwt',
// //   new JWTstrategy(opts, (jwt_payload, done) => {
// //     try {
// //       User.findOne({
// //         where: {
// //           id: jwt_payload.id,
// //         },
// //       }).then(user => {
// //         if(user) {
// //           console.log('user found in db in passport');
// //           done(null, user);
// //         } else {
// //           console.log('user not found in db');
// //           done(null, false);
// //         }
// //       });
// //     } catch (err) {
// //       done(err);
// //     }
// //   }),
// // );
//
// // ***** OLD CODE *****
//   // passport.use(
//   //   new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
//   //     // Match user
//   //     User.findOne({
//   //       email: email
//   //     }).then(user => {
//   //       if (!user) {
//   //         return done(null, false, { message: 'That email is not registered' });
//   //       }
//   //
//   //       // Match password
//   //       bcrypt.compare(password, user.password, (err, isMatch) => {
//   //         if (err) throw err;
//   //         if (isMatch) {
//   //           return done(null, user);
//   //         } else {
//   //           return done(null, false, { message: 'Password incorrect' });
//   //         }
//   //       });
//   //     });
//   //   })
//   // );
//
//   passport.serializeUser(function(user, done) {
//     done(null, user);
//   });
//
//   passport.deserializeUser(function(id, done) {
//     User.findById(id, function(err, user) {
//       done(err, user);
//     });
//   });
// };
//
//
// // OLD - Google Auth Strategy
// // passport.use(new GoogleStrategy({
// //     clientID: auth.clientId,
// //     clientSecret: auth.clientSecret,
// //     callbackURL: auth.clientCallback
// // }, function (token, refreshToken, profile, done) {
// //     process.nextTick(function () {
// //
// //         // Find the user based on their google id
// //         var details = extractProfile(profile);
// //         User.findOrCreate(details.id, function (err, user) {
// //             if (err) {
// //                 done(err, null);
// //             }
// //
// //             user.displayName = details.displayName;
// //             user.accessToken = token;
// //             user.save();
// //             done(null, user);
// //         });
// //     });
// //
//
module.exports = passport;
