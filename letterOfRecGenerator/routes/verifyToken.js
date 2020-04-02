const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {

  //const token = req.header('auth-token');
  console.log('SESSION STORE IS: ', req.sessionStore.sessions);
  console.log('SESSION ID: ', req.sessionID);
  const token = req.sessionStore['token'];

  if(token == null) return res.sendStatus(401)

  console.log('IN VERIFY: ', token)

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) {
          console.log("error with token or secret entered");
          res.sendStatus(403);
      }
      req.user = user
      next()
  })
};
