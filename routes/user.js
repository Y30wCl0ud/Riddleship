const express = require('express');
const router = express.Router();

router.get('/meet', (req, res) => {
// Try to use the database, pass an error if something fails
  // req.getConnection((err, connection) {
  //   if(err) return next(err);
  //   // Run a query on the database, pass an error if something fails
  //   connection.query('SELECT * FROM user', (err, results) {
  //     if(err) return next(err);
  //   });
  // });

  // req.getConnection((err, connection) => {
  //   if(err) return next(err);
  //
  //   connection.query('SELECT name,TIMESTAMPDIFF(YEAR, dob, CURDATE()) AS age, location FROM user WHERE admin = 0', (err, results) => {
  //     if(err) return next(err);
  //
  //     res.locals.user = results;
  //     res.render('user/meet');
  //
  //   });
  // });

  res.render('user/meet');
});

router.get('/meet_random', (req, res) => {
  res.render('user/meet_random');
});


router.get('/riddle', (req, res) => {
  res.render('user/riddle');
});

router.get('/riddle_game', (req, res) => {
  res.render('user/riddle_game');
});



module.exports = router;
