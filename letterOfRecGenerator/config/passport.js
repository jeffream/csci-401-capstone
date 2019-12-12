var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var auth = require('./auth');
var User = require('../models/user');

function extractProfile(profile) {
    return {
        id: profile.id,
        displayName: profile.displayName,
    };
}

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.findUser(id, function (err, user) {
        done(err, user);
    });
});

passport.use(new GoogleStrategy({
    clientID: auth.clientId,
    clientSecret: auth.clientSecret,
    callbackURL: auth.clientCallback
}, function (token, refreshToken, profile, done) {
    process.nextTick(function () {

        // Find the user based on their google id
        var details = extractProfile(profile);
        User.findOrCreate(details.id, function (err, user) {
            if (err) {
                done(err, null);
            }

            user.displayName = details.displayName;
            user.accessToken = token;
            user.save();
            done(null, user);
        });
    });

}));

module.exports = passport;