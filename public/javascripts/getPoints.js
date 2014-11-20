$(document).ready(function() {
    function makePoints(callback) {
        var points = [];
        $('img.points').each(function() {
            var loc = $(this).data('coords');
            var file = $(this).attr('src');
            points.push({
                coords: loc,
                file: file
            });
        });
        callback(points);
    }

    function initialize(points) {
        var mapOptions = {
            zoom: 12
        };
        var bounds = new google.maps.LatLngBounds();
        var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
        var infowindow = new google.maps.InfoWindow();
        for (var i = 0; i < points.length; i++) {
            var image = 'images/' + points[i].file;
            var latlng = points[i].coords.split(' ');
            var marker = new google.maps.Marker({
                position: new google.maps.LatLng(latlng[0], latlng[1]),
                map: map,
                animation: google.maps.Animation.DROP,
                title: points[i].file
            });
            bounds.extend(marker.position);
            
            google.maps.event.addListener(marker, 'click', (function(marker, i){
            	return function() {
            		var current = marker.position.k + ' ' + marker.position.B.toFixed(6);
            		$('.points').css('border', 'none');
            		$('img[data-coords="' + current + '"]').parent().css('background-color', '#F00');
            		infowindow.setContent('<img src="' + points[i].file + '" width="100px">');
            		infowindow.open(map, marker);
            	}
            })(marker, i));
        }
        map.fitBounds(bounds);

        function toggleBounce() {
            if (marker.getAnimation() != null) {
                marker.setAnimation(null);
            } else {
                marker.setAnimation(google.maps.Animation.BOUNCE);
            }
        }
        var w = window,
            d = document,
            e = d.documentElement,
            g = d.getElementsByTagName('body')[0],
            x = w.innerWidth || e.clientWidth || g.clientWidth,
            y = w.innerHeight || e.clientHeight || g.clientHeight;
            h = y - 45;
        $('#map-canvas').css('height', h + "px");
    }
    makePoints(function(points) {
        google.maps.event.addDomListener(window, 'load', initialize(points));
    });
    var $overlay = $('<img style="display:none;width:100%;height:100%;position:absolute;top:0;left:0;">');
    $('body').append($overlay);
    $('.points').click(function(){
    	var url = $(this).attr('src').replace('thumb', 'full');
    	$overlay.attr('src', url);
    	$overlay.show();
    });
    $overlay.click(function(){
    	$overlay.hide();
    });
});