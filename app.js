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
  res.locals.loggedIn = req.session.loggedIn;
  res.locals.admin = req.session.admin;

  next();
});



// use the defined routes
app.use('/', index);
app.use('/', user);
app.use('/', admin);



// open? listen to a port
app.listen(port, () => {
  console.log(`Listening at port ${port}`);
});
