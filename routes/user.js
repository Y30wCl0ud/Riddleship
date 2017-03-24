const express = require('express');
const router = express.Router();

router.get('/meet', (req, res) => {
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
