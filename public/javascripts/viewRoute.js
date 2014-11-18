var directionsDisplay;
var directionsService = new google.maps.DirectionsService();
var map;

function getPoints(callback) {
    var points = [];
    $('.list-group-item').each(function(i) {
        var coord = $(this).text();
        points.push(coord);
        if ($('.list-group-item').length === i + 1) {
            callback(points);
        }
    });
}

function initialize() {
    getPoints(function(points) {
        var rendererOptions = {
            draggable: true
        };
        directionsDisplay = new google.maps.DirectionsRenderer(rendererOptions);
        var start = new google.maps.LatLng(points[0]);
        var mapOptions = {
            zoom: 6,
            center: start
        }
        map = new google.maps.Map(document.getElementById('map-canvas-route'), mapOptions);
        directionsDisplay.setMap(map);

        var start = points[0];
        var end = points[points.length - 1];
        var waypts = [];
        for (var i = 1; i < points.length - 1; i++) {
            waypts.push({
                location: points[i],
                stopover: true
            });
        }

        var request = {
            origin: start,
            destination: end,
            waypoints: waypts,
            optimizeWaypoints: false,
            travelMode: google.maps.TravelMode.DRIVING
        };
        directionsService.route(request, function(response, status) {
            if (status == google.maps.DirectionsStatus.OK) {
                directionsDisplay.setDirections(response);
                var route = response.routes[0];
                var summaryPanel = document.getElementById('directions_panel');
                summaryPanel.innerHTML = '';
                // For each route, display summary information.
                for (var i = 0; i < route.legs.length; i++) {
                    var routeSegment = i + 1;
                    summaryPanel.innerHTML += '<li class="list-group-item"><h4 class="list-group-item-heading">Route Segment: ' + routeSegment + '</h4><p class="list-group-item-text">';
                    summaryPanel.innerHTML += route.legs[i].start_address + ' to ';
                    summaryPanel.innerHTML += route.legs[i].end_address + '<br>';
                    summaryPanel.innerHTML += route.legs[i].distance.text + '</p></li>';
                }
            }
        });
    });
}
google.maps.event.addDomListener(window, 'load', initialize);
