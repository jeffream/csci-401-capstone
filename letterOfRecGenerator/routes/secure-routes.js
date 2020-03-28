const express = require('express');

const router = express.Router();

//Let's say the route below is very sensitive and we want only authorized users to have access
//Routes in this file display information tailored according to the logged in user

//Get Rec Dashboard page
router.get('/recommender-dashboard', (req, res, next) =>
    res.json({
      message: 'You made it to rec dashboard secure route.',
      user: req.user,
      token : req.query.secret_token
    })
);

//Get Temp Editor page and pass in user
router.get('/template-editor', (req, res, next) =>
    res.json({
      user: req.user,
      token : req.query.secret_token
    })
);

router.get('/template-dashboard', (req, res, next) =>
    res.json({
      user: req.user,
      token : req.query.secret_token
    })
);

router.post('/template-editor', (req, res, next) =>
    res.json({
      user: req.user,
      token : req.query.secret_token
    })
);


module.exports = router;
