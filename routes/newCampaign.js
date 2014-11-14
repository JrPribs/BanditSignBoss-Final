var express = require('express');
var router = express.Router();
var stormpath = require('express-stormpath');
var _ = require('lodash');
var Firebase = require('firebase');
var dbRef = new Firebase('https://vivid-fire-567.firebaseio.com/BSB/userStore/');

router.post('/', stormpath.loginRequired, function(req, res) {
    var user = res.locals.user.username;
    var userRef = dbRef.child('users').child(user);
    var camps = userRef.child('campaigns');
    var newCampaign = camps.push({
        title: req.body.campaignTitle,
        created: Date.now(),
        author: user
    }, function(err) {
        if (err) {
            console.log("Data didn't save! :" + err);
        } else {
            var campaignId = newCampaign.key();
            camps.orderByChild("key").equalTo(campaignId).on("value", function(snapshot) {

                res.render("uploadPage", {
                    title: req.body.campaignTitle,
                    campaign: snapshot,
                    user: user
                });
            });
        }
    });
});

module.exports = router;
