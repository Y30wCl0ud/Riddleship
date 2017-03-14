const express = require('express');
const path = require('path');
const bodyparser = require('body-parser');

const port = 4000;

const app = express();

// 'importing' the routes
const index = require('./routes/index');
const login = require('./routes/login');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// body parser middleware
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended: false}));

// set static path
app.use(express.static(path.join(__dirname, 'public')));

// use the defined routes
app.use('/', index);
app.use('/login', login);


// GET & ...post... requests routes

app.route('/register')
  .get((req, res) => {
    res.locals.loggedIn = false;
    res.locals.admin = false;

    res.render('login/register');
  })
  .post((req, res) => {
    res.send('nothing to POST yet');
  });


app.get('/meet', (req, res) => {
  res.locals.loggedIn = true;
  res.locals.admin = false;

  res.render('user/meet');
});

app.get('/meet_random', (req, res) => {
  res.locals.loggedIn = true;
  res.locals.admin = false;

  res.render('user/meet_random');
});


app.get('/riddle', (req, res) => {
  res.locals.loggedIn = true;
  res.locals.admin = false;

  res.render('user/riddle');
});

app.get('/riddle_game', (req, res) => {
  res.locals.loggedIn = true;
  res.locals.admin = false;

  res.render('user/riddle_game');
});


app.get('/mychats', (req, res) => {
  res.locals.loggedIn = true;
  res.locals.admin = false;

  res.render('user/mychats');
});

// try with es6 arrow function
app.get('/mychats_menu', (req, res) => {
  res.locals.loggedIn = true;
  res.locals.admin = false;

  res.render('user/mychats_menu')
});

app.get('/contacts', (req, res) => {
  res.locals.loggedIn = true;
  res.locals.admin = false;

  res.render('user/contacts');
});

app.get('/chat', (req, res) => {
  res.locals.loggedIn = true;
  res.locals.admin = false;

  res.render('user/chat');
});

app.get('/my_profile', (req, res) => {
  res.locals.loggedIn = true;
  res.locals.admin = false;

  res.render('user/my_profile');
});

app.get('/profile', (req, res) => {
  res.locals.loggedIn = true;
  res.locals.admin = false;

  res.render('user/profile');
});



/*=============================================>>>>>
= admin part damnit =
===============================================>>>>>*/
app.get('/dashboard', (req, res) => {
  res.locals.loggedIn = true;
  res.locals.admin = true;

  res.render('admin/dashboard');
});

app.get('/reported', (req, res) => {
  res.locals.loggedIn = true;
  res.locals.admin = true;

  res.render('admin/reported');
});

app.get('/reported_o', (req, res) => {
  res.locals.loggedIn = true;
  res.locals.admin = true;

  res.render('admin/reported_o');
});



app.get('/chat_a', (req, res) => {
  res.locals.loggedIn = true;
  res.locals.admin = true;

  res.render('admin/chat_a');
});


app.get('/my_profile_a', (req, res) => {
  res.locals.loggedIn = true;
  res.locals.admin = true;

  res.render('admin/my_profile_a');
});


app.get('/profile_a', (req, res) => {
  res.locals.loggedIn = true;
  res.locals.admin = true;

  res.render('admin/profile');
});



// open? listen to a port
app.listen(port, () => {
  console.log(`Listening at port ${port}`);
});
