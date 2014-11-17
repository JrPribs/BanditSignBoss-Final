
var map;

function initialize() {
    var mapOptions = {
        zoom: 5,
        center: new google.maps.LatLng(38.473284, -94.633821)
    };
    map = new google.maps.Map(document.getElementById('map-canvas'),
        mapOptions);


    if ($('#add-marker').data('on') === 'on') {
        google.maps.event.addListener(map, 'click', function(event) {
            placeMarker(event.latLng);
        });

        function placeMarker(location) {
            var marker = new google.maps.Marker({
                position: location,
                map: map
            });
        }
    }
    $('#add-marker').click(function(){
    	$('#add-marker').data('on', 'off');
    });
}

google.maps.event.addDomListener(window, 'load', initialize);
