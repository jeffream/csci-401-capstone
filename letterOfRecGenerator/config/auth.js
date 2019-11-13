var {google} = require('googleapis');
var OAuth2 = google.auth.OAuth2;

var GOOGLE_CLIENT_ID = "901758022243-s3lganllgkco92plhqd3nu5htls9lqgo.apps.googleusercontent.com";
var GOOGLE_CLIENT_SECRET = "53uVjQJxwOZeScCV_yQrlf1H";
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
