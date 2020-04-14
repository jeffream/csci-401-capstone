const jwt = require('jsonwebtoken');
var db = require('../db') 
var User = require('../models/user'); 
module.exports = function (req, res, next) {

  var seshID = req.sessionID;
  //console.log('seshID: ', seshID);
  //console.log('Sessions: ', req.sessionStore);
  string = req.sessionStore.sessions[seshID];
  //console.log('STRING V IS: ', typeof(string));

  var obj;
  var token;

  if(string == undefined) {

    var sessionString = JSON.stringify(req.sessionStore.sessions);
    var tokenIndex = sessionString.search('token') + 10;
    //console.log('SESH STRING: ', sessionString);
    var endIndex = sessionString.search('"}"') - 1;
    token = sessionString.slice(tokenIndex, endIndex);
    //console.log('Token is: ', token);

  } else {
    obj = JSON.parse(string);
    token = obj.token;
  }

  if(token == null) return res.sendStatus(401)

  // Verify token and pass on user
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async function(err, user) {
      if (err) {
          console.log("error with token or secret entered");
          res.sendStatus(403);
      }
      // var d=User.getUser(user._id);

      // console.log(User.getUser(user._id));
      User.getUser(user._id, (err, user) => {
        if(err)
          res.status(404).json({
              msg: 'implementation not found'
          });

          // console.log("userid=>"+user);
          req.user = user;
          user.accessToken = token;

          next();
          // res.json(user); 
      })
  })
};
