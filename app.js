var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

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

// let words = [ 
//     "apple", "carrot", "bread", "egg", "car", "bus", "hot dog", "pickle", "card",
//     "sun", "moon", "cheese", "computer", "shoes", "guitar", "shirt", "toe", "chair", "blanket", "hand"
// ];

// let key = "https://cf.geekdo-images.com/medium/img/Ik_7CzT0b88EjL8MsZ4eTW8CLbI=/fit-in/500x500/filters:no_upscale()/pic2654543.png";


// app.get("/", (req, res) => {
//     res.sendFile(path.join(__dirname+'/public/index.html'));
// });

// app.get("/getCards", (req, res) => {
//     res.send(words);
// });

// app.get("/key", (req, res) => {
//     res.sendFile(path.join(__dirname+'/public/key.html'));
// });