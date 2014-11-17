var express = require('express');
var router = express.Router();
var stormpath = require('express-stormpath');
var _ = require('lodash');
var Firebase = require('firebase');

router.get('/', stormpath.loginRequired, function(req, res) {
    var user = res.locals.user.username;
    var userDataRef = new Firebase('https://vivid-fire-567.firebaseio.com/BSB/userStore/users/' + user + '/campaigns');
    userDataRef.on("value", function(snapshot) {
        var camps = snapshot.val();
        if (camps !== null) {
            var keys = Object.keys(camps);
            var campaigns = [];
            var count = 0;
            keys.forEach(function(key) {
                camps[key].id = key;
                count++;
                if (keys.length === count) {
                    res.render("campaigns", {
                        title: "Campaigns for " + user,
                        user: user,
                        campaigns: camps
                    });
                }
            });
        } else {
            res.render("campaigns", {
                title: "Campaigns for " + user,
                user: user
            });
        }
    });
});

module.exports = router;
