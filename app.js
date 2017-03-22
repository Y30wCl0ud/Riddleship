const express = require('express'),
      path = require('path'),
      bodyparser = require('body-parser'),
      session = require('express-session');
      validator = require('express-validator'),
      mysql = require('mysql'),
      myConnection = require('express-myconnection'),
      md5 = require('md5'),
      salt = 'MisterChocolateMintVanillaIceCreamThe3rd!Is3x3#PlaceChampion';

const port = 3000;
const app = express();

// 'importing' the routes
const index = require('./routes/index'),
      user = require('./routes/user'),
      admin = require('./routes/admin');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


//
app.use(myConnection(mysql, {
  host: 'localhost',
  user: 'student',
  password: 'serverSide',
  port: 3306,
  database: 'riddleshipdb'
} , 'request'));


// body parser middleware
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended: false}));
// app.use(validator());
// this line must be immediately after any of the bodyParser middlewares!
// app.use(validator());
app.use(validator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

app.use(session({
  secret: 'MisterChocolateMintVanillaIceCreamThe3rd!Is3x3#PlaceChampion',
  resave: false,
  saveUnitialized: true
}));

// set static path
app.use(express.static(path.join(__dirname, 'public')));

// Global variables
app.use((req, res, next) => {
  // res.locals.loggedIn = req.session.loggedIn;
  // res.locals.admin = req.session.admin;

  res.locals.loggedIn = true;
  res.locals.admin = false;

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
}, {
  id: 3,
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
