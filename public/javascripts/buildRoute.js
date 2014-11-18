var map;
var markers = [];

function numberPoints() {
    $('.list-group-item').each(function(index) {
        var count = index + 1;
        $(this).find('span').text(count);
    });
    $('.hidden-points').each(function(index){
        var count = index + 1;
        $(this).attr('name', count);
    });
    $('#point-count').attr('value', markers.length + 1);
}

function initialize() {
    var mapOptions = {
        zoom: 5,
        center: new google.maps.LatLng(38.473284, -94.633821)
    };
    map = new google.maps.Map(document.getElementById('map-canvas-route'),
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
        $('#points').append('<input class="hidden-points" type="hidden" value="' + markLoc + '" name="' + count + '"/>');
        $('#point-count').attr('value', markers.length + 1);
        markers.push(markLoc);
        console.log(markers);
        google.maps.event.addListener(marker, 'dblclick', function(event) {
            this.setMap(null);
            var markLoc = this.position.toString().replace(/\(/, '').replace(/\)/, '');
            var arrPos = markers.indexOf(markLoc);
            markers.splice(arrPos, 1);
            $('li:contains("' + markLoc + '")').remove();
            $('.hidden-points[value="' + markLoc + '"]').remove();
            numberPoints();
            console.log(markers);
        });

    }

}

google.maps.event.addDomListener(window, 'load', initialize);
