var express = require('express');
var router = express.Router();

/* GET form entry page. */
router.get('/', function(req, res, next) {
    res.render('pages/form-completed', {
        title: 'Form Completed!',
    });
});

module.exports = router;