var express = require('express');
var router = express.Router();
var stormpath = require('express-stormpath');
var _ = require('lodash');
var Firebase = require('firebase');

router.get('/', stormpath.loginRequired, function(req, res) {
    var user = res.locals.user;
    var campaigns = false;
    var routes = false;
    var userDataRef = new Firebase('https://vivid-fire-567.firebaseio.com/BSB/userStore/' + user.username);
    userDataRef.once("value", function(snapshot) {
        var acctData = snapshot.val();
        if (acctData !== null) {
            campaigns = acctData.campaigns;
            routes = acctData.routes;
        }
        res.render("dashboard", {
            title: user.username + "'s Dashboard",
            user: user.username,
            campaigns: campaigns,
            routes: routes
        });
    });
});

module.exports = router;
