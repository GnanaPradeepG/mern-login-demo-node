let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
let passport = require('passport');
const mongoose = require('mongoose');
const cors = require('cors')

//routes
let indexRouter = require('./routes/index');
let usersRouter = require('./routes/users');
let adminsRouter = require('./routes/admins');

//security
let config = require('./config');
let authenticate = require('./authenticate');

//mongo db

const url = config.mongoUrl;
const connect = mongoose.connect(url);

connect.then((db) => {
  console.log("connected correctly to server");
}, (err) => { console.log(err) });


let app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(express.static(path.join(__dirname, 'public')));

let session = require('express-session');
let FileStore = require('session-file-store')(session);

app.use(passport.initialize());

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/admins' , adminsRouter);

function auth(req, res, next) {

  if (!req.user) {
    let err = new Error('You are not authenticated!');
    err.status = 403;
    next(err);
  }
  else {
    next();
  }
}

app.use(auth);

//    do not touch this piece  error handling     //

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
