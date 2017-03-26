const express = require('express');
const router = express.Router();

router.get('/dashboard', (req, res) => {
  res.render('admin/dashboard');
});

router.get('/reported', (req, res) => {
  res.render('admin/reported');
});

// to be removed
router.get('/reported_o', (req, res) => {
  res.render('admin/reported_o');
});

router.get('/users', (req, res) => {
  req.getConnection((err, connection) => {
    if(err) return next(err);
    connection.query('SELECT * FROM user WHERE admin = 0', (err, results) => {
      res.locals.results = results;
      res.render('admin/users');
    });
  });

  // res.render('admin/users');
});

router.get('/users/menu', (req, res) => {
  res.render('admin/users_menu');
});

router.get('/users/online', (req, res) => {
  res.render('admin/users_online');
});

router.get('/users/blocked', (req, res) => {
  res.render('admin/users_ban');
});

router.get('/users/ban', (req, res) => {
  res.render('admin/ban');
});

router.get('/profile/menu', () => {
  res.render('admin/profile_menu');
});


module.exports = router;
