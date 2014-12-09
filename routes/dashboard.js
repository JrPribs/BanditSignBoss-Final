var express = require('express');
var router = express.Router();
var stormpath = require('express-stormpath');
var request = require('request');

router.get('/', stormpath.loginRequired, function(req, res) {
    var user = res.locals.user;
    var userUrl = res.locals.user.href.split('/');
    var userId = userUrl[userUrl.length -1];
    delete user['apiKeys'];
    delete user['groupMemberships']
    delete user['applications']
    delete user['tenant']
    delete user['directory']
    delete user['providerData']
    delete user['href']
    var campaigns = false;
    var routes = false;
    var options = {
        uri: 'http://api.banditsignboss.com/api/dashboard/' + userId,
        method: 'POST',
        json: user
    };
    request(options, function(err, res, body){
        if(!err & res.statusCode == 200 ){
            res.render("dashboard", {
                title: user.username + "'s Dashboard",
                user: user.username,
                campaigns: campaigns,
                routes: routes
            });
        }
    });
});

module.exports = router;
