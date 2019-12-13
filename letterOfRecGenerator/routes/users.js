const express = require('express');
const router = express.Router();

//Login Page
router.get('/login', (req, res) => res.render('login'));

//Register Page
router.get('/register', (req, res) => res.render('register'));

/* GET users listing. */
// router.get('/', function (req, res, next) {
//     User.find(function (err, results) {
//         if (err) {
//             res.send("Oops...");
//         } else {
//             res.send(results);
//         }
//     });
// });

module.exports = router;
