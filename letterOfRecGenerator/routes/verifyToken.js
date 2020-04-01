const jwt = require('jsonwebtoken');

module.exports = function isAuthenticated(req, res, next) {

  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

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
}
