const express = require('express');
const router = express.Router();

// GET the homepage/index
router.get('/' , function(req, res) {
  res.render('index');
  // need to redirect depending on logged in and role
});

router.route('/login') // harder to read this way imo
  .get((req, res, next) => {
    res.render('login')
  })

  .post((req, res) => {

    req.check('email', 'invalid email').isEmail().notEmpty();
    req.check('password', 'invalid password').notEmpty();

    var errors = req.validationErrors(); // stores all errors
    if (errors) {
      req.session.errors = errors;
      // req.session.loggedIn = 0;
      res.redirect('/login');

    } else {
      var user = {
        email: req.body.email,
        password: req.body.password
      }

      req.getConnection((err, connection) => {
        if(err) return next(err);

        connection.query('SELECT * FROM user WHERE email = ? AND password = ?', [user.email, user.password], (err, results) => {
          if(err) return next(err);
          console.log(`his name is ${results[0].name} and is loggedIn and is ${results[0].admin} admin`);
          req.session.loggedIn = 1;
          req.session.admin = results[0].admin; // chekc whether user is admin
          console.log(req.session.admin == true);
          if(req.session.admin) {
            res.redirect('/dashboard');
          } else {
            res.redirect('/meet');
          }
        });
      });
    }
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


// Logout and redirect
router.get('/my_profile/logout', function(req, res, next){
  req.session.destroy(function(){
    res.redirect("/");
  });
});


module.exports = router;
