const express = require('express');
const path = require('path');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const app = express();
const students = require('./routes/students');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

const env = process.env.NODE_ENV || 'development';
const config = require('./config/config')[env];

const mysql = require('mysql');
const con = mysql.createConnection({
  host: config.database.host,
  user: config.database.user,
  password: config.database.password,
  database: config.database.db
});

passport.use(new LocalStrategy(
  function(username, password, done) {
    con.query('SELECT * FROM users WHERE first_name = ? and password = ?', 
    [username, password], function(err, rows, fields) {
      if(err) return done(err);
		
      // if user not found
      if (rows.length <= 0) {
        return done('Incorrect username or password.');
      } 
      return done(null, rows[0]);
    });
  }
));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  con.query('SELECT * FROM users WHERE id = ?', [id], function(err, user) {
    if(err) return done(err);
    done(null, user);
  });
});

app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')(
  { secret: 'keyboard cat', resave: false, saveUninitialized: false })
);

// Initialize Passport and restore authentication state, if any, from the
// session.
app.use(passport.initialize());
app.use(passport.session());

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated())
    return next();
  res.redirect('/login');
}

app.get('/', isAuthenticated, function(req, res) {
  res.render('index', {title: 'Express'});
});

app.get('/logout',
  function(req, res){
    req.logout();
    res.redirect('/');
});

app.get('/login',
  function(req, res){
    res.render('signin');
  }
);
  
app.post('/login', 
  passport.authenticate('local', { 
    successRedirect: '/',
    failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
});

app.use('/students', isAuthenticated, students);

module.exports = app;

app.listen(3000, () => console.log('Example app listening on port 3000!'));
