var express = require('express');
var router = express.Router();
var stormpath = require('express-stormpath');
var _ = require('lodash');
var Firebase = require('firebase');

router.get('/', stormpath.loginRequired, function(req, res) {
    var user = res.locals.user;
    var userDataRef = new Firebase('https://vivid-fire-567.firebaseio.com/BSB/userStore/' + user.username);
    userDataRef.once("value", function(snapshot) {
        var acctData = snapshot.val()
        var campaigns = acctData.campaigns;
        var routes = acctData.routes;
        res.render("dashboard", {
            title: user.username + "'s DashBoard",
            user: user.username,
            campaigns: campaigns,
            routes: routes
        });
    });
});

module.exports = router;
