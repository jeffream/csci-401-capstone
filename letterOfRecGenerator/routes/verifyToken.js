const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {

  var seshID = req.sessionID;
  //console.log('seshID: ', seshID);
  console.log('Sessions: ', req.sessionStore);
  string = req.sessionStore.sessions[seshID];
  //console.log('STRING V IS: ', typeof(string));

  var obj;
  var token;

  if(string == undefined) {

    var sessionString = JSON.stringify(req.sessionStore.sessions);
    var tokenIndex = sessionString.search('token') + 10;
    var temp1 = sessionString.search('length') + 9;
    var temp2 = temp1 + 5;
    var tokenLength = sessionString.slice(temp1, temp2);
    console.log('TLENGTH: ', tokenLength);
    var lastIndex = tokenIndex + tokenLength - 5;
    token = sessionString.slice(tokenIndex, lastIndex);
    console.log('Token is: ', token);

  } else {
    obj = JSON.parse(string);
    token = obj.token;
  }

  if(token == null) return res.sendStatus(401)

  // Verify token and pass on user
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) {
          console.log("error with token or secret entered");
          res.sendStatus(403);
      }
      req.user = user
      user.accessToken = token;
      //console.log('USER IN VERFIY: ', user);
      next()
  })
};
