const express = require('express');
const router = express.Router();

router.get('/dashboard', (req, res) => {
  res.render('admin/dashboard');
});

router.get('/reported', (req, res) => {
  res.render('admin/reported');
});

// To be removed
router.get('/reported_o', (req, res) => {
  res.render('admin/reported_o');
});

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

router.get('/users/ban/:id', (req, res) => {
  req.getConnection((err, connection) => {
    if (err) return next(err);
    connection.query('SELECT name, userID FROM user WHERE userID = ?', req.params.id, (err, results) => {
      if (err) return nect(err);
      res.render('admin/banUser', {results: results[0]});
    });
  });
});

router.post('/users/ban/:id', (req, res) => {
  req.getConnection((err, connection) => {
    if (err) return next(err);
    connection.query('UPDATE user SET banned = 1 WHERE userID = ?', req.params.id, (err, results) => {
      if (err) return next(err);
      res.redirect('/users/banned');
    });
  });
});

router.get('/users/unban/:id', (req, res) => {
  req.getConnection((err, connection) => {
    if (err) return next(err);
    connection.query('SELECT name, userID FROM user WHERE userID = ?', req.params.id, (err, results) => {
      if (err) return nect(err);
      res.render('admin/unbanUser', {results: results[0]});
    });
  });
});

router.post('/users/unban/:id', (req, res) => {
  req.getConnection((err, connection) => {
    if (err) return next(err);
    connection.query('UPDATE user SET banned = 0 WHERE userID = ?', req.params.id, (err, results) => {
      if (err) return next(err);
      res.redirect('/users/banned');
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
