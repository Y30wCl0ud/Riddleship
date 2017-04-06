const express = require('express');
const router = express.Router();

router.get('/api/:id', (req, res, next) => {
  req.getConnection((err, connection) => {
    if (err) return next(err);
    connection.query('SELECT * FROM user WHERE userID = ?', req.params.id, (err, results) => {
      if (err) {
        next(err)
      } else {
        console.log(results);
        res.send(results);
        // res.end();
        next();
      }
    });
  });
});

module.exports = router;
