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
    //console.log('SESH STRING: ', sessionString);
    var slicedString = sessionString.slice(tokenIndex, sessionString.length);
    console.log('SLICED: ', slicedString);
    var lastIndex = sessionString.indexOf('}');
    token = sessionString.slice(tokenIndex, lastIndex - 1);
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
