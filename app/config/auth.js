// var {google} = require('googleapis');
// var OAuth2 = google.auth.OAuth2;
//
// var GOOGLE_CLIENT_ID = "468934162681-cbfmk6ung8pm2jaqsf68r9e24vb888j5.apps.googleusercontent.com";
// var GOOGLE_CLIENT_SECRET = "5BktU-GsMF8nf-SFmQFD7vSJ";
// var GOOGLE_CALLBACK = 'http://128.125.100.147:80/auth/google/callback';
//
// var oauth2Client = new OAuth2(
//   GOOGLE_CLIENT_ID,
//   GOOGLE_CLIENT_SECRET,
//   GOOGLE_CALLBACK
// );
//
// module.exports = {
//     clientId: GOOGLE_CLIENT_ID,
//     clientSecret: GOOGLE_CLIENT_SECRET,
//     clientCallback: GOOGLE_CALLBACK,
//     oauth2Client
// };


module.exports = {
  ensureAuthenticated: function(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    req.flash('error_msg', 'Please log in to view that resource');
<<<<<<< HEAD:letterOfRecGenerator/config/auth.js
    res.redirect('/users/login');
=======
    res.redirect('/auth/login');
>>>>>>> 8912f3dc87304c7b0983955dac40b8ae5e2cc2ea:app/config/auth.js
  },
  forwardAuthenticated: function(req, res, next) {
    if (!req.isAuthenticated()) {
      return next();
    }
    res.redirect('../views/pages/recommender-dashboard');
  }
};
