const express = require('express'),
      path = require('path'),
      bodyparser = require('body-parser'),
      validator = require('express-validator'),
      mysql = require('mysql'),
      myConnection = require('express-myconnection');



const port = 3000;

const app = express();




// 'importing' the routes
const index = require('./routes/index'),
      user = require('./routes/user'),
      admin = require('./routes/admin');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// body parser middleware
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended: false}));

// set static path
app.use(express.static(path.join(__dirname, 'public')));
// app.use(express.static(__dirname + '/public')); same

// Global variables
app.use((req, res, next) => {
  res.locals.loggedIn = true;
  res.locals.admin = true;

  // variables for now
  res.locals.results = results;

  next();
});



// for the simple prototype now
var results = [{
  id: 1,
  name: 'John',
  age: 23,
  gender: 'male',
  location: 'Charles Town',
  lookingFor: 'female',
  about: 'hi this is about me and stuff',
  email: 'john@msn.nl',

  reported: false,
  reporter: null,
  reason: 'Ze is all meer dan een maand inactief in de riddle',
  date: 'null'
}, {
  id: 2,
  name: 'Jen',
  age: 27,
  gender: 'female',
  location: 'Que Town',
  lookingFor: 'male',
  about: 'hi this is about me and stuff',
  email: 'jen@live.com',

  reported: true,
  reporter: 'John',
  reason: 'Ze is all meer dan een maand inactief in de riddle',
  date: '12-02-17'
}]




// use the defined routes
app.use('/', index);
app.use('/', user);
app.use('/', admin);

// open? listen to a port
app.listen(port, () => {
  console.log(`Listening at port ${port}`);
});
