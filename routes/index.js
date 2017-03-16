const express = require('express');
const router = express.Router();



// GET the homepage/index
router.get('/' , function(req, res) {
  res.render('index');
  // need to redirect depending on logged in and role
});

router.route('/login')
  .get((req, res) => {
    res.render('login');
  })
  .post((req, res) => {
    res.send('posted');
});

router.route('/register')
  .get((req, res) => {
    res.render('register');
  })
  .post((req, res) => {
    res.send('nothing to POST yet');
});

/*=============================================>>>>>
= General links =
===============================================>>>>>*/
router.get('/mychats', (req, res) => {
  res.render('general/mychats');
});

router.get('/mychats/menu', (req, res) => {
  res.render('general/mychats_menu')
});

router.get('/chat/:id', (req, res) => {
  res.locals.id = req.params.id;
  res.render('general/chat');
});

router.get('/contacts', (req, res) => {
  res.render('general/contacts');
});

router.get('/contacts/menu', (req, res) => {
  res.render('general/contacts_menu');
});

router.get('/my_profile', (req, res) => {
  res.render('general/my_profile');
});

router.get('/profile/:id', (req, res) => {
  res.locals.id = req.params.id;

  res.render('general/profile');
});


module.exports = router;
