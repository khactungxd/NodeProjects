$(function(){
	var supermandant = getUrlVars()["supermandant"];
	$.get("/data_for_map?supermandant="+supermandant,function(data){
		//alert(data);
		data = JSON.parse(data);
		$('#map_canvas').gmap().bind('init', function (ev, map) {
			$.each( data, function(i, marker) {
				if(marker.number_of_requests==0&&marker.response_time==0){
					return;
				}else{
					if(marker.depth ==2){
						$('#map_canvas').gmap('addMarker', { 
							'position': new google.maps.LatLng(marker.lat, marker.lng), 
							'bounds': true,
							'icon': 'images/marker_2.png'
						}).click(function() {
							var content = '<p>Name : '+marker.name+'</p><p>Number Of Request : '+marker.number_of_requests+'</p><p>Response Time : '+marker.response_time+'</p>';
							$('#map_canvas').gmap('openInfoWindow', { 'content': content }, this);
						});
					}else{
						$('#map_canvas').gmap('addMarker', { 
							'position': new google.maps.LatLng(marker.lat, marker.lng), 
							'bounds': true
							//'icon': 'images/marker_2.png'
						}).click(function() {
							var content = '<p>Name : '+marker.name+'</p><p>Number Of Request : '+marker.number_of_requests+'</p><p>Response Time : '+marker.response_time+'</p>';
							$('#map_canvas').gmap('openInfoWindow', { 'content': content }, this);
						});
					}
					
					
				}
			});
		});
	});
});

function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}
