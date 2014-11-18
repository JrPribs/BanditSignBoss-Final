var express = require('express');
var router = express.Router();
var stormpath = require('express-stormpath');
var _ = require('lodash');
var Firebase = require('firebase');

router.get('/:campaignId', stormpath.loginRequired, function(req, res) {
    var user = res.locals.user.username;
    var campaignId = req.param('campaignId');
    var campaignRef = new Firebase('https://vivid-fire-567.firebaseio.com/BSB/userStore/' + user + '/campaigns/' + campaignId);
    campaignRef.once("value", function(snapshot) {
        var campaignData = snapshot.val();
        res.render('campaignDetails', {
            user: user,
            campaignId: campaignId,
            campaign: campaignData
        });
    });
});

router.get('/:campaignId/view-map', stormpath.loginRequired, function(req, res) {
    var user = res.locals.user.username;
    var campaignId = req.param('campaignId');
    var campaignRef = new Firebase('https://vivid-fire-567.firebaseio.com/BSB/userStore/' + user + '/campaigns/' + campaignId);
    campaignRef.once("value", function(snapshot) {
        var campaignData = snapshot.val();
        res.render('viewMap', {
            user: user,
            campaignId: campaignId,
            campaign: campaignData,
            scripts: ['https://maps.googleapis.com/maps/api/js?key=AIzaSyCU42Wpv6BtNO51t7xGJYnatuPqgwnwk7c', '/javascripts/getPoints.js']
        });
    });
});


module.exports = router;