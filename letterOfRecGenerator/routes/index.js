const express = require('express');
//const User = require('../models/user');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');

// Welcome Page
router.get('/', (req, res) => res.render('welcome'));

// Dashboard
router.get('/recommender-dashboard', ensureAuthenticated, (req, res) =>
  res.render('recommender-dashboard'));


module.exports = router;
