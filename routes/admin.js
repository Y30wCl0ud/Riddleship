const express = require('express');
const router = express.Router();

router.get('/dashboard', (req, res) => {
  res.render('admin/dashboard');
});

// not made yet
// router.get('/reported', (req, res) => {
//   res.render('admin/reported');
// });

router.get('/users', (req, res) => {
  req.getConnection((err, connection) => {
    if(err) return next(err);
    connection.query('SELECT * FROM user WHERE admin = 0', (err, results) => {
      if (err) return next(err);
      res.locals.results = results;
      res.render('admin/users');
    });
  });
});

router.get('/users/online', (req, res) => {
  res.render('admin/users_online');
});

router.get('/users/banned', (req, res) => {
  req.getConnection((err, connection) => {
    if (err) return next(err);
    connection.query('SELECT * FROM user WHERE banned = 1', (err, results) => {
      if (err) return next(err);
      res.render('admin/users_ban', {results: results});
    });
  });
});

router.post('/users/ban/:id', (req, res) => {
  req.getConnection((err, connection) => {
    if (err) return next(err);
    connection.query('UPDATE user SET banned = 1 WHERE userID = ?', req.params.id, (err, results) => {
      if (err) return next(err);
      res.end();
    });
  });
});

router.post('/users/unban/:id', (req, res) => {
  req.getConnection((err, connection) => {
    if (err) return next(err);
    connection.query('UPDATE user SET banned = 0 WHERE userID = ?', req.params.id, (err, results) => {
      if (err) return next(err);
      res.end();
    });
  });
});

router.get('/users/delete/:id', (req, res) => {
  req.getConnection((err, connection) => {
    if (err) return next(err);
    connection.query('SELECT name, userID FROM user WHERE userID = ?', req.params.id, (err, results) => {
      if (err) return next(err);
      res.render('admin/deleteUser', {results: results[0]});
    })
  });
});

router.post('/users/delete/:id', (req, res, next) => {
  req.getConnection((err, connection) => {
    if (err) return next(err);
    connection.query('DELETE FROM user WHERE userID = ?', req.params.id, (err, results) => {
      if (err) return next(err);
      res.redirect('/users/');
    });
  });
});

module.exports = router;
