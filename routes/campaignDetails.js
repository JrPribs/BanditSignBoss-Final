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

router.get('/:campaignId/routes/new-route', stormpath.loginRequired, function(req, res) {
    var user = res.locals.user.username;
    var campaignId = req.param('campaignId');
    var routesRef = new Firebase('https://vivid-fire-567.firebaseio.com/BSB/userStore/' + user + '/campaigns/' + campaignId + '/routes');
    var newRoute = routesRef.push();
    res.render('buildRoute', {
        user: user,
        campaignId: campaignId,
        routeId: newRoute.key(),
        scripts: ['http://code.jquery.com/jquery-1.11.0.min.js', 'https://maps.googleapis.com/maps/api/js?key=AIzaSyCU42Wpv6BtNO51t7xGJYnatuPqgwnwk7c', '/javascripts/buildRoute.js']
    });
});

router.post('/:campaignId/routes/:routeId/view-route', stormpath.loginRequired, function(req, res) {
    var user = res.locals.user.username;
    var campaignId = req.param('campaignId');
    var routeId = req.param('routeId');
    var points = [];
    var pointCount = req.body.pointCount;
    for(var i=1; i<=pointCount; i++){
        points.push(req.body[i]);
    }
    console.log(points);
    res.render('viewRoute', {
        user: user,
        campaignId: campaignId,
        routeId: routeId,
        points: points,
        scripts: ['http://code.jquery.com/jquery-1.11.0.min.js', 'https://maps.googleapis.com/maps/api/js?key=AIzaSyCU42Wpv6BtNO51t7xGJYnatuPqgwnwk7c', '/javascripts/viewRoute.js']
    });
});

module.exports = router;
