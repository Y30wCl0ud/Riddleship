const express = require('express');
const router = express.Router();

router.get('/meet', (req, res) => {
  console.log(req.session.ID);
  req.getConnection((err, connection) => {
    if(err) return next(err);

    connection.query('SELECT userID, name,TIMESTAMPDIFF(YEAR, dob, CURDATE()) AS age, location FROM user WHERE admin = 0 AND userID != ?', myID, (err, results) => {
      if(err) return next(err);

      res.locals.results = results;
      res.render('user/meet');
    });
  });

  // for local testing
  // res.locals.results = results;
  // res.render('user/meet');
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
