const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {

  //const token = req.header('auth-token');
  var seshID = req.sessionID;
  parsed = req.sessionStore.sessions[seshID];
  console.log('SESSION IS: ', parsed);
  console.log('SESSION ID: ', req.sessionID);
  var obj = JSON.parse(parsed);
  var tokenIndex = parsed.search('token');
  console.log('TOKEN: ', obj.token);



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
