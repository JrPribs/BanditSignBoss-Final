var express = require('express');
var stormpath = require('express-stormpath');
var path = require('path');
var logger = require('morgan');
var multer = require('multer');

var index = require('./routes/index');
var uploads = require('./routes/uploads');
var dashboard = require('./routes/dashboard');
var campaigns = require('./routes/campaigns');
var campaign = require('./routes/campaignDetails');
var newCampaign = require('./routes/newCampaign');
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
    apiKeyFile: '/Users/jpribesh/.stormpath/apiKey.properties',
    application: 'https://api.stormpath.com/v1/applications/5OEXbG5BaE5SJQ5bGKHKeD',
    secretKey: '2gYxQyynHmlwPsghFwqDjdff3hIUgh778onj',
	enableUsername: true,
	requireUsername: true,
	sessionDuration: 1000 * 60 * 20,
	cache: 'memory'
}));

app.use('/', index);
app.use('/dashboard', dashboard);
app.use('/newCampaign', newCampaign);
app.use('/campaigns', campaigns);
app.use('/campaign', campaign);

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