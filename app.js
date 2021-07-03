var createError = require('http-errors');
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var homeRouter = require('./main/routers/home');
var usersRouter = require('./main/routers/users');

var app = express();

// Mongoose Connection

var mongoose = require('mongoose');

var mongoString = "mongodb+srv://EnkripsiAES128:enkripsiAES128@cluster0.3yt2b.gcp.mongodb.net/EnkripsiAES128?retryWrites=true&w=majority"

mongoose.connect(mongoString, {useNewUrlParser: true})

mongoose.connection.on("error", function(error) {
  console.log(error)
});

mongoose.connection.on("open", function() {
  console.log("Connected to MongoDB database.")
});

mongoose.set('useCreateIndex', true);
mongoose.Promise = global.Promise;


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'assets')));

app.use('/', homeRouter);
app.use('/', usersRouter);
app.use('/signUp', usersRouter);
app.use('/pesanMasuk', usersRouter);
app.use('/bacaPesan', usersRouter);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
