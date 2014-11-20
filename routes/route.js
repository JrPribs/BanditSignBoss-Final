var express = require('express');
var router = express.Router();
var stormpath = require('express-stormpath');
var Firebase = require('firebase');

router.post('/new', stormpath.loginRequired, function(req, res) {
    var user = res.locals.user.username;
    console.log(req.body);
    var routeTitle = req.body['route-title'];
    var routesRef = new Firebase('https://vivid-fire-567.firebaseio.com/BSB/userStore/' + user + '/routes');
    var newRoute = routesRef.push({title: routeTitle});
    var routeKey = newRoute.key();
    routesRef.child(routeKey).update({id: routeKey});
    res.render('buildRoute', {
        title: routeTitle + ' Route',
        user: user,
        routeTitle: routeTitle,
        routeId: newRoute.key(),
        styles: ['/stylesheets/routes.css'],
        scripts: ['http://code.jquery.com/jquery-1.11.0.min.js', 'https://maps.googleapis.com/maps/api/js?key=AIzaSyCU42Wpv6BtNO51t7xGJYnatuPqgwnwk7c', '/javascripts/buildRoute.js']
    });
});

router.post('/:routeId/view', stormpath.loginRequired, function(req, res) {
    var user = res.locals.user.username;
    var routeId = req.param('routeId');
    var points = [];
    var pointCount = req.body.pointCount;
    for(var i=1; i<=pointCount; i++){
        points.push(req.body[i]);
    }
    var routeRef = new Firebase('https://vivid-fire-567.firebaseio.com/BSB/userStore/' + user + '/routes/' + routeId);
    routeRef.set({points: points});
    res.render('viewRoute', {
        user: user,
        routeId: routeId,
        points: points,
        styles: ['/stylesheets/routes.css'],
        scripts: ['http://code.jquery.com/jquery-1.11.0.min.js', 'https://maps.googleapis.com/maps/api/js?key=AIzaSyCU42Wpv6BtNO51t7xGJYnatuPqgwnwk7c', '/javascripts/viewRoute.js']
    });
});

module.exports = router;