var express = require('express');
var router = express.Router();
var util = require('util');
var fs = require('fs');
var im = require('imagemagick');
var stormpath = require('express-stormpath');
var _ = require('lodash')
var Firebase = require('firebase');

function processData(req, res, next) {

    function gatherImages(files, callback) {

        //accept single image upload
        if (!_.isArray(files)) {
            files = [files];
        }

        var uploads = [];
        var count = 0;
        files.forEach(function(file) {

            fs.exists(file.path, function(exists) {
                if (exists) {
                    var name = req.body[file.originalname];
                    console.log(name);
                    var path = file.path;
                    var upFile = file.name;
                    uploads.push({
                        file: upFile,
                        imgPath: path,
                        caption: name || 'no comment'
                    });
                    count++;
                }
                if (files.length === count) {
                    callback(uploads);
                }
            });

        });

    }

    function getGeoLoc(path, callback) {
        im.readMetadata('./' + path, function(error, metadata) {
            var geoCoords = false;
            if (error) throw error;

            if (metadata.exif.gpsLatitude && metadata.exif.gpsLatitudeRef) {
                var lat = getDegrees(metadata.exif.gpsLatitude.split(','));
                var latRef = metadata.exif.gpsLatitudeRef;
                if (latRef === 'S') {
                    lat = lat * -1;
                }
                var lng = getDegrees(metadata.exif.gpsLongitude.split(','));
                var lngRef = metadata.exif.gpsLongitudeRef;
                if (lngRef === 'W') {
                    lng = lng * -1;
                }
                var coordinate = {
                    lat: lat,
                    lng: lng
                };
                geoCoords = coordinate.lat + ' ' + coordinate.lng;
                console.log(geoCoords);
            }

            callback(geoCoords);
        });
    }

    function getDegrees(lat) {
        var degrees = 0;
        for (var i = 0; i < lat.length; i++) {
            var cleanNum = lat[i].replace(' ', '');
            var parts = cleanNum.split('/');
            var coord = parseInt(parts[0]) / parseInt(parts[1]);
            if (i == 1) {
                coord = coord / 60;
            } else if (i == 2) {
                coord = coord / 3600;
            }
            degrees += coord;
        }
        return degrees.toFixed(6);
    }

    function processImages(uploads, callback) {
        var finalImages = [];
        var count = 0;
        uploads.forEach(function(upload) {
            var path = upload.imgPath;
            getGeoLoc(path, function(geoCoords) {
                upload.coords = geoCoords;
                finalImages.push(upload);
                count++;
                if (uploads.length === count) {
                    callback(finalImages);
                }
            });
        });
    }


    if (req.files) {
        if (req.files.size === 0) {
            return next(new Error("Why didn't you select a file?"));
        }

        gatherImages(req.files.imageFiles, function(uploads) {
            processImages(uploads, function(finalImages) {
                req.finalImages = finalImages;
                req.campaignId = req.param('campaignId');
                next();
            });
        });
    }

}

function saveImageInfo(req, res, next) {
    var user = res.locals.user;
    var count = 0;
    var campaignPhotosRef = new Firebase('https://vivid-fire-567.firebaseio.com/BSB/userStore/' + user.username + '/campaigns/' + req.campaignId + '/photos');
    var finalImages = req.finalImages;
    finalImages.forEach(function(image) {
        campaignPhotosRef.push(image, function(err) {
            if (err) {
                console.log(err);
            } else {
                console.log('Data saved successfully: ' + image);
                count++;
                if (req.finalImages.length === count) {
                    next();
                }
            }
        });
    });

}




router.post("/:campaignId", stormpath.loginRequired, processData, saveImageInfo, function(req, res) {
    res.render("uploadMapPage", {
        title: "File(s) Uploaded Successfully!",
        files: req.finalImages,
        campaignId: req.campaignId,
        scripts: ['https://maps.googleapis.com/maps/api/js?key=AIzaSyCU42Wpv6BtNO51t7xGJYnatuPqgwnwk7c', '/javascripts/getPoints.js']
    });

});

module.exports = router;
