var map;
var markers = [];

function numberPoints() {
    $('.list-group-item').each(function(index) {
        var count = index + 1;
        $(this).find('span').text(count);
    });
}

function initialize() {
    var mapOptions = {
        zoom: 5,
        center: new google.maps.LatLng(38.473284, -94.633821)
    };
    map = new google.maps.Map(document.getElementById('map-canvas'),
        mapOptions);

    google.maps.event.addListener(map, 'rightclick', function(event) {
        addMarker(event.latLng);
    });

    function addMarker(location) {
        var marker = new google.maps.Marker({
            position: location,
            map: map
        });
        var markLoc = location.toString().replace(/\(/, '').replace(/\)/, '');
        var count = markers.length + 1;
        $('#points-list').append('<li class="list-group-item"><span class="label label-info">' + count + '</span>' + markLoc + '</li>');
        markers.push(markLoc);
        console.log(markers);
        google.maps.event.addListener(marker, 'dblclick', function(event) {
            this.setMap(null);
            var markLoc = this.position.toString().replace(/\(/, '').replace(/\)/, '');
            var arrPos = markers.indexOf(markLoc);
            markers.splice(arrPos, 1);
            $('li:contains("' + markLoc + '")').remove();
            numberPoints();
            console.log(markers);
        });

    }

}
    function calcRoute() {
        var directionsDisplay;
        var directionsService = new google.maps.DirectionsService();
        var points = markers;
        directionsDisplay = new google.maps.DirectionsRenderer();
        var chicago = new google.maps.LatLng(points[0]);
        var mapOptions = {
            zoom: 6,
            center: chicago
        }
        map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
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
                    summaryPanel.innerHTML += '<b>Route Segment: ' + routeSegment + '</b><br>';
                    summaryPanel.innerHTML += route.legs[i].start_address + ' to ';
                    summaryPanel.innerHTML += route.legs[i].end_address + '<br>';
                    summaryPanel.innerHTML += route.legs[i].distance.text + '<br><br>';
                }
            }
        });
    }
google.maps.event.addDomListener(window, 'load', initialize);
