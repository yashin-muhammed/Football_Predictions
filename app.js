var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
const sessions = require('express-session');
var logger = require('morgan');

let PORT=process.env.PORT||4050;
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/user/users');
var leagueRouter = require('./routes/leagues/leagues');
var teamRouter = require('./routes/teams/teams');
var fixtureRouter = require('./routes//fixtures/fixtures');
var dataRouter = require('./routes/data/data');
var resultsRouter = require('./routes/results/results');
var scoresRouter = require('./routes/score/score');
//var userLogin = require('./routes/user');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// creating 24 hours from milliseconds
const oneDay = 1000 * 60 * 60 * 24;
//session middleware
app.use(sessions({
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized:true,
    cookie: { maxAge: oneDay },
    resave: false
}));

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/leagues', leagueRouter);
app.use('/teams', teamRouter);
app.use('/fixtures', fixtureRouter);
app.use('/data', dataRouter);
app.use('/results', resultsRouter);
app.use('/score', scoresRouter);

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
  console.log(err)
});

app.listen(PORT,() =>{
  console.log(`Server running at http://localhost:${PORT}/`);
});

process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

module.exports = app;
