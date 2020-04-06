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
    var periodIndex1 = sessionString.indexOf('.');
    console.log('PERIOD 1: ', sessionString.charAt(periodIndex1));
    var slicedString = sessionString.slice(periodIndex1 + 1, sessionString.length);
    var periodIndex2 = sessionString.indexOf('.');
    console.log('PERIOD 2: ', sessionString.charAt(periodIndex2));
    var slicedString2 = sessionString.slice(periodIndex2 + 1, sessionString.length);
    var quoteIndex = sessionString.search('"');
    token = sessionString.slice(tokenIndex, quoteIndex);
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
