var {google} = require('googleapis');
var OAuth2 = google.auth.OAuth2;

var GOOGLE_CLIENT_ID = "274852723407-v426d79gb3637uih6rk315ld5quo4agb.apps.googleusercontent.com";
var GOOGLE_CLIENT_SECRET = "uvHdD3nN7oj20OdsX09_3teK";
var GOOGLE_CALLBACK = 'http://recommendation.usc.edu/auth/google/callback';

var oauth2Client = new OAuth2(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_CALLBACK
);

module.exports = {
    clientId: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    clientCallback: GOOGLE_CALLBACK,
    oauth2Client
};
