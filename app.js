const path = require('path');

const express = require('express'),
      bodyparser = require('body-parser'),
      multer = require('multer'),
      session = require('express-session'),
      validator = require('express-validator'),
      mysql = require('mysql'),
      myConnection = require('express-myconnection');

const port = 3000;
const app = express();

// 'importing' the routes
const index = require('./routes/index'),
      user = require('./routes/user'),
      admin = require('./routes/admin'),
      api = require('./routes/api');
var myID;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// defining upload destination
var upload = multer({dest: 'public/uploads/'});

// mysql connection
app.use(myConnection(mysql, {
  host: '127.0.0.1',
  user: 'root',
  password: 'root',
  // socketPath : '/Applications/MAMP/tmp/mysql/mysql.sock',
  port: 3306,
  database: 'riddleshipdb'
} , 'request'));

// body parser middleware
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended: false}));

app.use(upload.single('profilePic'));

// this line must be immediately after any of the bodyParser middlewares!
app.use(validator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root = namespace.shift()
      , formParam = root;

    while (namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param: formParam,
      msg: msg,
      value: value
    };
  }
}));

app.use(session({
  secret: 'MisterChocolateMintVanillaIceCreamThe3rd!Is3x3#PlaceChampion',
  resave: false,
  saveUnitialized: true
}));

// Set static path
app.use(express.static(path.join(__dirname, 'public')));

// Global variables
app.use((req, res, next) => {
  res.locals.loggedIn = req.session.loggedIn;
  res.locals.admin = req.session.admin;
  res.locals.myName = req.session.myName;
  next();
});

// Use the defined routes
app.use('/', index);
app.use('/', user);
app.use('/', admin);
app.use('/', api);

// Source: 404  http://www.hacksparrow.com/express-js-custom-error-pages-404-and-500.html
app.use(function(req, res) {
    res.status(404);
    res.render('404.ejs', {title: '404: File Not Found', message: "This page is still in construction or doesn't exist(yet)"});
});

app.listen(port, () => {
  console.log(`Listening at port ${port}`);
});
