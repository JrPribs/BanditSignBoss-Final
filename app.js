var express = require('express');
var stormpath = require('express-stormpath');
var path = require('path');
var logger = require('morgan');
var multer = require('multer');

var routes = require('./routes/index');
var uploads = require('./routes/uploads');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(multer({
	dest: './public/images/',
    rename: function(fieldname, filename){
        return fieldname + Date.now();
    }
}));

app.use(express.static(path.join(__dirname, 'public')));



app.use(stormpath.init(app, {
	enableUsername: true,
	requireUsername: true,
	sessionDuration: 1000 * 60 * 20,
	cache: 'memory'
}));

app.use('/', routes);
app.use('/uploads', uploads);

// error handlers
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;