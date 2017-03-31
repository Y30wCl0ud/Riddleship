const express = require('express');
const router = express.Router();

router.get('/meet', (req, res) => {
  req.getConnection((err, connection) => {
    if(err) return next(err);

    connection.query('SELECT userID, name,TIMESTAMPDIFF(YEAR, dob, CURDATE()) AS age, location FROM user WHERE admin = 0 AND userID != ?', myID, (err, results) => {
      if(err) return next(err);

      res.locals.results = results;
      res.render('user/meet');
    });
  });
});

router.get('/meet_random', (req, res) => {
  req.getConnection((err, connection) => {
    if (err) return next(err);
    connection.query('SELECT userID FROM user WHERE userID != ?', myID, (err, results) => {
      const i = Math.floor(Math.random() * results.length);

      res.render('user/meet_random', {results: results[i].userID});
    });
  });
});


router.get('/riddle', (req, res) => {
  res.render('user/riddle');
});

router.get('/riddle_game', (req, res) => {
  res.render('user/riddle_game');
});



module.exports = router;
