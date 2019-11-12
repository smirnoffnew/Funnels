require('dotenv').config()
var verifyToken = require('./config/verifyToken');
var createError = require('http-errors');
var express = require('express');
const cors = require('cors');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var app = express();

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

var testRoute = require('./routes/test');
app.use('/', testRoute);

let fileShare = require('./routes/routes')
app.use('/', fileShare);



app.use(
  //verifyToken,
   express.static('public'));
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

});

var http = require('http');
var port = 3001;
app.set('port', port);
var server = http.createServer(app);
server.listen(port);

module.exports = app;
