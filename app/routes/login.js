var express = require('express');
var router = express.Router();

/* GET login page. */
router.get('/', function (req, res, next) {
    res.render('login', {
        title: 'Letter of Recommendation Generator',
        subtitle: '',
        url: '/auth/google'
    });
});

module.exports = router;
