const express = require('express');
const router = express.Router();

// no need to set the path because it is set in app.js as app.use
//
// router.get('/', function(req, res) {
//   res.locals.loggedIn = false;
//   res.locals.admin = false;
//
//   res.render('login/login');
// });


router.route('/')
  .get(function(req, res) {
    res.locals.loggedIn = false;
    res.locals.admin = false;

    res.render('login/login');
  })
  .post(function(req, res){
    res.send('posted');
  });


module.exports = router;
