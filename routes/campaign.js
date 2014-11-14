var express = require('express');
var router = express.Router();
var stormpath = require('express-stormpath');
var _ = require('lodash');
var Firebase = require('firebase');

router.get('/:campaignId', stormpath.loginRequired, function(req, res) {
    var user = res.locals.user.username;
    var campaignId = req.param('campaignId');
    var campaignRef = new Firebase('https://vivid-fire-567.firebaseio.com/BSB/userStore/users/' + user + '/campaigns/' + campaignId);
    campaignRef.on("value", function(snapshot) {
        var campaignData = snapshot.val();
        var photoCount = Object.keys(campaignData.photos).length;
        res.render('campaignDetails', {
        	user: user,
            campaign: campaignData,
            photoCount: photoCount
        });
    });
});


module.exports = router;
