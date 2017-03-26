const express = require('express');
const router = express.Router();
const md5 = require('md5');
const salt = 'MisterChocolateMintVanillaIceCreamThe3rd!Is3x3#PlaceChampion';


// GET the homepage/index
router.get('/' , function(req, res) {
  res.render('index');
  // need to redirect depending on logged in and role
});

router.route('/login') // harder to read this way imo
  .get((req, res, next) => {
    res.render('login');
  })

  .post((req, res) => {
    // validate input
    req.check('email', 'Invalid email').isEmail().notEmpty();
    req.check('password', 'Invalid password').notEmpty();

    let errors = req.validationErrors(); // stores all errors
    if (errors) {
      req.session.errors = errors;

    } else {
      let user = {
        email: req.body.email,
        password: md5(req.body.password + salt)
      }

      req.getConnection((err, connection) => {
        if(err) return next(err);

        connection.query('SELECT * FROM user WHERE email = ? AND password = ?', [user.email, user.password], (err, results) => {
          if(err) return next(err);

          console.log(`his name is ${results[0].name} and is loggedIn and is ${results[0].admin} admin`);


          req.session.loggedIn = 1;
          req.session.admin = results[0].admin; // check whether user is admin
          req.session.ID = results[0].userID;
          myID = req.session.ID; // set the global var to access own ID
          console.log(req.session.admin == true);
          console.log(myID);
          if(req.session.admin) {
            res.redirect('/dashboard');
          } else {
            res.redirect('/meet');
          }
        });
      });
    }
  });

router.get('/register', (req, res) => {
  res.render('register');
});

router.post('/register', (req, res) => {
  req.check('email', 'Invalid email').isEmail().notEmpty();
  req.check('password', 'Enter a (longer) password').notEmpty().isLength({min: 6}).equals(req.body.confirmPassword);

  let errors = req.validationErrors(); // stores all errors
  if (errors) {
    req.session.errors = errors;
  } else {
    let newUser = {
      email: req.body.email,
      name: req.body.name,
      password: md5(req.body.password + salt),
      gender: req.body.gender,
      dob: req.body.dob,
      location: req.body.location,
      lookingFor: req.body.lfor,
      minAge: req.body.minAge,
      maxAge: req.body.maxAge,
      about: req.body.about,
    }
    if(req.file !== undefined) {
      fs.rename(req.file.path, req.file.destination + req.file.originalname, function(err){
        if(err) return next(err);
      });

      newUser.picture = req.file.originalname;
    }

    req.getConnection((err, connection) => {
      if(err) return next(err);

      connection.query('INSERT INTO user set ?', [newUser], (err, results) => {
        if(err) return next(err);

        res.redirect('/');
      });
    });
  }
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
  req.getConnection((err, connection) => {
    if(err) return next(err);
    connection.query('SELECT DISTINCT user.name, contact.userA, contact.userB FROM user JOIN contact ON user.userID = contact.userA OR user.userID = contact.userB WHERE ? = contact.userA OR ? = contact.userB', [myID, myID], (err, results) => {
      console.log(results);
      // res.locals.results = results;
      res.send(results);
    });
  });
  // res.render('general/contacts');
});

router.get('/contacts/menu', (req, res) => {
  res.render('general/contacts_menu');
});

router.get('/my_profile', (req, res) => {
  // picture = user.picture where id = myID
  console.log(myID);
  req.getConnection((err, connection) => {
    if(err) return next(err);
    connection.query('SELECT *, TIMESTAMPDIFF(YEAR, dob, CURDATE()) AS age FROM user WHERE userID = ?', myID, (err, results) => {
      res.locals.results = results[0];

      res.locals.picture = 'admin1.jpg';
      res.render('general/my_profile');
    });
  });
});

router.get('/profile/:id', (req, res) => {
  req.getConnection((err, connection) => {
    if(err) return next(err);
    connection.query('SELECT *, TIMESTAMPDIFF(YEAR, dob, CURDATE()) AS age FROM user WHERE userID = ?', req.params.id, (err, results) => {
      if(err) return next(err);
      res.locals.results = results[0];
      res.render('general/profile');
    });
  });
});


// Logout and redirect
router.get('/my_profile/logout', function(req, res, next){
  req.session.destroy(function(){
    res.redirect("/");
  });
});


module.exports = router;
