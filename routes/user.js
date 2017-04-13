const express = require('express');
const router = express.Router();

router.get('/meet', (req, res, next) => {
  let userSelf;
  req.getConnection((err, connection) => {
    if(err) return next(err);
    connection.query('SELECT * FROM user WHERE userID = ?', req.session.ID, (err, results) => {
      if (err) return next(err);
      userSelf = results[0];

      // new query to be able to utilise userSelf
      connection.query('SELECT userID, name, TIMESTAMPDIFF(YEAR, dob, CURDATE()) AS age, location FROM user WHERE admin = 0 AND userID != ? AND IF (? = "both", gender = "male" OR gender = "female", gender = ?) HAVING age BETWEEN ? AND ?', [req.session.ID, userSelf.lookingFor, userSelf.lookingFor, userSelf.minAge, userSelf.maxAge], (err, results) => {
        if(err) return next(err);
        res.locals.results = results;
        res.render('user/meet');
      });
    });
  });
});

router.get('/meet_random', (req, res, next) => {
  let userSelf;
  req.getConnection((err, connection) => {
    if(err) return next(err);
    connection.query('SELECT * FROM user WHERE userID = ?', req.session.ID, (err, results) => {
      if (err) return next(err);
      userSelf = results[0];

      connection.query('SELECT userID, name, TIMESTAMPDIFF(YEAR, dob, CURDATE()) AS age, location FROM user WHERE admin = 0 AND userID != ? AND IF (? = "both", gender = "male" OR gender = "female", gender = ?) HAVING age BETWEEN ? AND ?', [req.session.ID, userSelf.lookingFor, userSelf.lookingFor, userSelf.minAge, userSelf.maxAge], (err, results) => {
        if(err) return next(err);
        const i = Math.floor(Math.random() * results.length); // randomly select a match according to user preferrences
        res.render('user/meet_random', {results: results[i].userID});
      });
    });
  });
});

// not made yet
// router.get('/riddle', (req, res) => {
//   res.render('user/riddle');
// });
//
// router.get('/riddle_game', (req, res) => {
//   res.render('user/riddle_game');
// });



module.exports = router;
