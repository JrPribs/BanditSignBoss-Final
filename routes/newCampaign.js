var express = require('express');
var router = express.Router();
var stormpath = require('express-stormpath');
var _ = require('lodash');
var Firebase = require('firebase');
var dbRef = new Firebase('https://vivid-fire-567.firebaseio.com/BSB/userStore/users');

function formatDate(epochDate) {
    var d = new Date(epochDate);
    var year = d.getFullYear();
    var month = d.getMonth() + 1;
    var day = d.getDate();
    var date = month + '-' + day + '-' + year;
    return date;
}

function formatTime(epochDate) {
    var d = new Date(epochDate);
    var hr = d.getHours();
    var ampm = (hr >= 12) ? "PM" : "AM";
    var hr = (hr > 12) ? hr - 12 : hr;
    var min = d.getMinutes();
    if (min.toString().length == 1) {
        min = '0' + min
    }
    var time = hr + ':' + min + ' ' + ampm;
    return time;
}

router.post('/', stormpath.loginRequired, function(req, res) {
    
    function getData(campaignId) {
        var thisCampaign = new Firebase('https://vivid-fire-567.firebaseio.com/BSB/userStore/users/' + res.locals.user.username + '/campaigns/' + campaignId);
        thisCampaign.on("value", function(snapshot) {
            var campaignData = snapshot.val();
            res.render("campaignDetails", {
                title: req.body.campaignTitle,
                campaign: campaignData,
                campaignId: campaignId,
            });
        });
    }

    var user = res.locals.user.username;
    var userRef = dbRef.child(user);
    var camps = userRef.child('campaigns');
    var campaignId = '';
    var newCampaign = camps.push({
        title: req.body.campaignTitle,
        createDate: formatDate(Date.now()),
        createTime: formatTime(Date.now()),
        photoCount: 0,
        photos: {},
        user: {
            user: user,
            name: res.locals.user.fullName,
            email: res.locals.user.email
        }
    }, function(err) {
        if (err) {
            console.log("Data didn't save! :" + err);
        } else {
            campaignId = newCampaign.key();

            getData(campaignId);
        }
    });

});

module.exports = router;
