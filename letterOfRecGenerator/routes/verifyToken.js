const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {

  var seshID = req.sessionID;
  console.log('seshID: ', seshID);
  console.log('Sessions: ', req.sessionStore);
  string = req.sessionStore.sessions[seshID];
  console.log('STRING V IS: ', typeof(string));
  //console.log('SESSION IS: ', parsed);
  //console.log('SESSION ID: ', req.sessionID);
  var obj = JSON.parse(string);
  var token = obj.token;

  if(token == null) return res.sendStatus(401)

  // Verify token and pass on user
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) {
          console.log("error with token or secret entered");
          res.sendStatus(403);
      }
      req.user = user
      next()
  })
};
