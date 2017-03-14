const express = require('express');
const router = express.Router();

// GET the homepage/index
router.get('/' , function(req, res) {
  res.locals.loggedIn = false;
  res.locals.admin = false;

  res.locals.loggedIn = true;
  // res.locals.admin = true;
  //

  res.render('index');
});

module.exports = router;
