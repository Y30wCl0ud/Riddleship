const express = require('express');
const md5 = require('md5');
const fs = require('fs');

const router = express.Router();
const salt = 'MisterChocolateMintVanillaIceCreamThe3rd!Is3x3#PlaceChampion';

// GET the homepage/index
router.get('/', (req, res) => {
  res.render('index', {error: ''});
  // Need to redirect depending on logged in and role
});

router.get('/login', (req, res) => {
    res.render('login', {error: ''});
  })

router.post('/', (req, res, next) => {
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
            // console.log(req.session.ID);
            if (req.session.admin) {
              res.redirect('/dashboard');
            } else {
              res.redirect('/meet');
            }
          } else {
            res.render('index', {error: 'The email and/or password is incorrect.'});
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

      connection.query('INSERT INTO user SET ?', [newUser], (err, results) => {
        if (err) return next(err);
        res.redirect('/');
      });
    });
  }
});

/*  =============================================>>>>>
= General links =
===============================================>>>>>  */

router.get('/mychats', (req, res, next) => {
  req.getConnection((err, connection) => {
    if (err) return next(err);
    connection.query('SELECT DISTINCT user.userID, user.name, chat.message, CONCAT(LEFT(chat.message, 40), "...") AS shortMsg,chat.date FROM user JOIN chat ON (user.userID = chat.ontvanger OR user.userID = chat.verzender) WHERE (? = chat.verzender OR ? = chat.ontvanger) GROUP BY user.name ORDER BY chat.date DESC', [req.session.ID, req.session.ID], (err, results) => {
      if (err) return next(err);
      res.render('general/mychats', {results: results, myID:req.session.ID});
    });
  });
});

router.get('/chat/:id', (req, res, next) => {
  req.getConnection((err, connection) => {
    if (err) return next(err);
    connection.query('SELECT DISTINCT user.userID, user.name, chat.verzender, chat.ontvanger, chat.message, chat.date, DATE(chat.date) AS fullDate FROM user JOIN chat ON user.userID = chat.verzender WHERE ? = chat.verzender AND ? = chat.ontvanger OR ? = chat.verzender AND ? = chat.ontvanger ORDER BY chat.date ASC', [req.session.ID, req.params.id, req.params.id, req.session.ID], (err, results) => {
      if (err) return next(err);

      // if there are messages display them else show the name of the partner only
      if (results.length > 0) {
        res.render('general/chat', {results: results, id: req.params.id});
      } else {
        connection.query('SELECT * FROM user WHERE userID = ?', req.params.id, (err, results) => {
          if (err) return next(err);
          res.render('general/chat', {results: results, id: req.params.id});
        });
      }
    });
  });
});

router.post('/chat/:id', (req, res, next) => {
  const postMessage = {
    verzender: req.session.ID,
    ontvanger: req.params.id,
    message: req.body.message
  };

  if (req.body.message.length > 0) {
    req.getConnection((err, connection) => {
      if (err) return next(err);
      connection.query('INSERT INTO chat SET ?', [postMessage], (err, results) => {
        if (err) return next(err);
        res.redirect(`/chat/${req.params.id}`);
      });
    });
  }
});

router.get('/contacts', (req, res, next) => {
  req.getConnection((err, connection) => {
    if (err) return next(err);
    connection.query('SELECT DISTINCT user.userID ,user.name, contact.userA, contact.userB FROM user JOIN contact ON user.userID = contact.userA OR user.userID = contact.userB WHERE ? = contact.userA OR ? = contact.userB', [req.session.ID, req.session.ID], (err, results) => {
      if (err) return next(err);

      // if there are results show them else add 2/admin to contacts
      if (results.length > 0) {
        res.render('general/contacts', {results: results});
      } else {
        const addContact = {
          userA: 2,
          userB: req.session.ID
        };
        connection.query('INSERT INTO contact SET ?', [addContact], (err, results) => {
          if (err) return next(err);
          // Redirect to self because results is not defined yet
          res.redirect(req.get('referer'));
        });
      }
    });
  });
});

router.get('/profile/:id', (req, res, next) => {
  req.getConnection((err, connection) => {
    if (err) return next(err);
    connection.query('SELECT *, TIMESTAMPDIFF(YEAR, dob, CURDATE()) AS age FROM user WHERE userID = ?', req.params.id, (err, results) => {
      if (err) return next(err);
      res.render('general/profile', {results: results[0]});
    });
  });
});

router.get('/my_profile', (req, res, next) => {
  // picture = user.picture where id = req.session.ID
  req.getConnection((err, connection) => {
    if (err) return next(err);
    connection.query('SELECT *, TIMESTAMPDIFF(YEAR, dob, CURDATE()) AS age FROM user WHERE userID = ?', req.session.ID, (err, results) => {
      if (err) return next(err);
      res.render('general/my_profile', {results: results[0], picture: 'admin1.jpg'});
    });
  });
});

// Partly from Source: CMD back-end
router.get('/my_profile/edit', (req, res, next) => {
  req.getConnection((err, connection) => {
    if (err) return next(err);
    connection.query('SELECT * FROM user WHERE userID = ?', req.session.ID, (err, results) => {
      if (err) return next(err);
      res.render('general/edit', {results: results[0]});
    });
  });
});

router.post('/my_profile/edit', (req, res, next) => {
  const newInfo = {
    location: req.body.location,
    minAge: req.body.minAge,
    maxAge: req.body.maxAge,
    about: req.body.about,
  };

  if (req.file !== undefined) {
    fs.rename(req.file.path, req.file.destination + req.file.originalname, (err) => {
      if (err) return next(err);
    });
    newInfo.picture = req.file.originalname;
  }
  req.getConnection((err, connection) => {
    if (err) return next(err);
    connection.query('UPDATE user SET ? WHERE userID = ?', [newInfo, req.session.ID], (err, results) => {
      if (err) return next(err);
      res.redirect('/my_profile');
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
