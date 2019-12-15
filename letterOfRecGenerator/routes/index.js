const express = require('express');
//const User = require('../models/user');
const router = express.Router();

// router.use(function (req, res, next) {
//     res.locals.userValue = null;
//     next();
// });

/* GET home page. */
router.get('/', (req, res) => res.render('welcome'));

<<<<<<< HEAD
// Dashboard
router.get('/dashboard', ensureAuthenticated, (req, res) =>
  res.render('dashboard'));
=======
// router.get('/', function (req, res, next) {
//     res.render('pages/index', {
//         title: 'Express',
//         header: 'Add user'
//     });
// });
>>>>>>> parent of ae7cd2e... potentially finish login with authentication, needs testing

// router.post('/', function (req, res) {
//     var user = {
//         name: {
//             first: req.body.fname,
//             last: req.body.lname
//         }
//     };
//
//     User.createUser(user);
//
//     res.render('pages/index', {
//         title: 'Express',
//         header: 'Add User',
//         userValue: user.name
//     });
// });

module.exports = router;
