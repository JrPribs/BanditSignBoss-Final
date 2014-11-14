var Firebase = require('firebase');

var dbRef = new Firebase('https://vivid-fire-567.firebaseio.com/BSB/userKeys/');

var usersRef = dbRef.child("users");
//usersRef.set({
//	jpribesh: {
//		campaigns: [1, 2, 3],
//		name: "John pribesh"
//	},
//	davgonzalez: {
//		campaigns: [4, 5, 6],
//		name: "David Gonzalez"
//	}
//});
var userRef = usersRef.child('jpribesh');
var camps = userRef.child('campaigns');
// Using .push adds a unique id to each "post", need to use for campaigns
var newCamp = camps.push({
    title: "Test Campaign 1",
    author: "jpribesh",
    date: Date.now()
}, function(err) {
    if (err) {
        console.log("Data didn't save! :" + err);
    } else {
        console.log("Data saved successfully!");
        var campaignId = newCamp.key();
        console.log(campaignId);
    }
});
