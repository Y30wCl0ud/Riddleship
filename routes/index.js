const express = require('express');
const md5 = require('md5');

const router = express.Router();
const salt = 'MisterChocolateMintVanillaIceCreamThe3rd!Is3x3#PlaceChampion';

// GET the homepage/index
router.get('/', (req, res) => {
  res.render('index');
  // Need to redirect depending on logged in and role
});

router.get('/login', (req, res) => {
    res.render('login', {error: ''});
  })

router.post('/login', (req, res, next) => {
    // Validate input
    req.check('email', 'Invalid email').isEmail().notEmpty();
    req.check('password', 'Invalid password').notEmpty();

    // Stores all errors
    const errors = req.validationErrors();
    if (errors) {
      req.session.errors = errors;

    } else {
      const user = {
        email: req.body.email,
        password: md5(req.body.password + salt)
      };

      req.getConnection((err, connection) => {
        if (err) return next(err);

        connection.query('SELECT * FROM user WHERE email = ? AND password = ?', [user.email, user.password], (err, results) => {
          if (err) return next(err);
          if (results.length > 0) {
            console.log(`his name is ${results[0].name} and is loggedIn and is ${results[0].admin} admin`);

            req.session.loggedIn = 1;
            req.session.admin = results[0].admin; // Check whether user is admin
            req.session.ID = results[0].userID;
            req.session.myName = results[0].name;
            myID = req.session.ID; // Set the global var to access own ID

            console.log(myID);
            if(req.session.admin) {
              res.redirect('/dashboard');
            } else {
              res.redirect('/meet');
            }
          } else {
            res.render('login', {error: 'The email and/or password is incorrect.'});
          }
        });
      });
    }
  });

router.get('/register', (req, res) => {
  res.render('register');
});

router.post('/register', (req, res, next) => {
  req.check('email', 'Invalid email').isEmail().notEmpty();
  req.check('password', 'Enter a (longer) password').notEmpty().isLength({min: 6}).equals(req.body.confirmPassword);

  const errors = req.validationErrors(); // stores all errors
  if (errors) {
    req.session.errors = errors;
  } else {
    const newUser = {
      email: req.body.email,
      name: req.body.name,
      password: md5(req.body.password + salt),
      gender: req.body.gender,
      dob: req.body.dob,
      location: req.body.location,
      lookingFor: req.body.lfor,
      minAge: req.body.minAge,
      maxAge: req.body.maxAge,
      about: req.body.about
    };
    if (req.file !== undefined) {
      fs.rename(req.file.path, req.file.destination + req.file.originalname, (err) => {
        if (err) return next(err);
      });

      newUser.picture = req.file.originalname;
    }

    req.getConnection((err, connection) => {
      if (err) return next(err);

      connection.query('INSERT INTO user set ?', [newUser], (err, results) => {
        if (err) return next(err);

        res.redirect('/');
      });
    });
  }
});

/*=============================================>>>>>
= General links =
===============================================>>>>>*/

router.get('/mychats', (req, res, next) => {
  req.getConnection((err, connection) => {
    if (err) return next(err);
    connection.query('SELECT DISTINCT user.userID, user.name, chat.message FROM user JOIN chat ON user.userID = chat.ontvanger WHERE ? = chat.verzender OR ? = chat.ontvanger', [myID, myID], (err, results) => {
      if (err) return next(err);
      res.render('general/mychats', {results: results});
    });
  });
});

router.get('/mychats/menu', (req, res) => {
  res.render('general/mychats_menu');
});

router.get('/chat/:id', (req, res, next) => {
  req.getConnection((err, connection) => {
    if (err) return next(err);
    connection.query('SELECT DISTINCT user.userID, user.name, chat.verzender, chat.ontvanger, chat.message, chat.date, DATE(chat.date) AS fullDate FROM user JOIN chat ON user.userID = chat.verzender WHERE ? = chat.verzender AND ? = chat.ontvanger OR ? = chat.verzender AND ? = chat.ontvanger ORDER BY chat.date ASC', [myID, req.params.id, req.params.id, myID], (err, results) => {
      if (err) return next(err);
      res.render('general/chat', {results: results});
    });
  });
});

router.get('/contacts', (req, res, next) => {
  req.getConnection((err, connection) => {
    if (err) return next(err);
    connection.query('SELECT DISTINCT user.userID ,user.name, contact.userA, contact.userB FROM user JOIN contact ON user.userID = contact.userA OR user.userID = contact.userB WHERE ? = contact.userA OR ? = contact.userB', [myID, myID], (err, results) => {
      if (err) return next(err);
      res.render('general/contacts', {results: results});
    });
  });
});

router.get('/contacts/menu', (req, res) => {
  res.render('general/contacts_menu');
});

router.get('/my_profile', (req, res, next) => {
  // picture = user.picture where id = myID
  req.getConnection((err, connection) => {
    if (err) return next(err);
    connection.query('SELECT *, TIMESTAMPDIFF(YEAR, dob, CURDATE()) AS age FROM user WHERE userID = ?', myID, (err, results) => {
      if (err) return next(err);
      res.render('general/my_profile', {results: results[0], picture: 'admin1.jpg'});
    });
  });
});

router.get('/profile/:id', (req, res, next) => {
  req.getConnection((err, connection) => {
    if (err) return next(err);
    connection.query('SELECT *, TIMESTAMPDIFF(YEAR, dob, CURDATE()) AS age FROM user WHERE userID = ?', req.params.id, (err, results) => {
      if (err) return next(err);
      // res.locals.results = results[0];
      res.render('general/profile', {results: results[0]});
    });
  });
});

// Logout and redirect
router.get('/my_profile/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});

module.exports = router;
