var express = require('express');
var router = express.Router();
var util = require('util');
var fs = require('fs');
var im = require('imagemagick');
var stormpath = require('express-stormpath');
var _ = require('lodash')
var Firebase = require('firebase');

router.get('/:campaignId', stormpath.loginRequired, function(req, res) {
    var campaignId = req.param('campaignId');
    var user = res.locals.user.username;
    var campaignRef = new Firebase('https://vivid-fire-567.firebaseio.com/BSB/userStore/' + user + '/campaigns/' + campaignId);
    campaignRef.once('value', function(snapshot) {
        var data = snapshot.val();
        var campaignTitle = data.title;
        res.render("uploadPage", {
            title: "Upload Photos for " + campaignTitle,
            campaignId: campaignId
        });
    });
});

module.exports = router;
