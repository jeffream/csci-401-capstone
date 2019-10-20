var express = require('express');
var router = express.Router();

/* GET login page. */
router.get('/', function (req, res, next) {
    res.render('pages/login', {
        title: 'LETTER OF RECOMMENDATION GENERATOR',
        subtitle: '',
        url: '/auth/google'
    });
});

module.exports = router;