const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {

  var seshID = req.sessionID;
  // console.log('seshID: ', seshID);
  // console.log('Sessions: ', req.sessionStore);
  string = req.sessionStore.sessions[seshID];
  //console.log('STRING V IS: ', typeof(string));


  // Searching through session info to find User ID number
  // var sessionString = JSON.stringify(req.sessionStore.sessions);
  // var id_index = sessionString.search('id') + 7;
  // var id_index_lastNum = id_index + 24;
  // var userID = sessionString.slice(id_index, id_index_lastNum);

  var obj;
  var token;

  if(string == undefined) {

    var sessionString = JSON.stringify(req.sessionStore.sessions);
    var tokenIndex = sessionString.search('token') + 7;
    console.log('SESH STRING: ', sessionString);
    var endIndex = sessionString.search('}"}') - 3;
    token = sessionString.slice(tokenIndex, endIndex);
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
      next()
  })
};
