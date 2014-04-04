var mapScreen=new Screen();
mapScreen.init=function(smName, prevScreen, mandantName){	
	this.GUI=$('#mapScreen');
		
	if (typeof prevScreen !== 'undefined'){
		this.prevScreen=prevScreen;			
	} else {
		this.GUI.find('.btBack').css('display','none');
	}
	this.supermandant=smName;
	if (typeof mandantName !== 'undefined' && mandantName!=""){
		this.mandant=mandantName;
		this.GUI.find('.screenTitle').html(LANGUAGE.MAP_VIEW+" ("+mandantName+" - "+smName+")");
	} else {	
		this.mandant="";
		this.GUI.find('.screenTitle').html(LANGUAGE.MAP_VIEW+" ("+smName+")");
	}
			
	this.initDate();		
}

mapScreen.addMarker=function(e){		
	var color="green";
	if (e.response_time>=3) color="red";
	
	var imgUrl='images/markers/'+e.depth+color+'.png';
	var req=Number((parseFloat(e.number_of_requests)).toFixed(0));
	var res=Number((parseFloat(e.response_time)).toFixed(2));
	
	$('#map_canvas').gmap('addMarker', {'position': e.lat+' , '+e.lng ,'bounds': true, 'icon': imgUrl}).click(function() {
		$('#map_canvas').gmap('openInfoWindow', {'content': '<div class="markerTitle">'+paloDecode(e.name)+'</div><table class="markerTable"><tr><td>'+LANGUAGE.NUMBER_OF_REQUESTS+'</td><td class="textRight">'+req+'</td></tr><tr><td>'+LANGUAGE.RESPONSE_TIME+'</td><td class="textRight">'+res+'</td></tr></table>'}, this);
	});
}
mapScreen.reloadScreenBody=function(){
	var thisScreen=this;		
	
	var url="webservice/data/for_map?supermandant="+thisScreen.supermandant+"&mandant="+thisScreen.mandant+"&day="+thisScreen.selectedDay+"&month="+thisScreen.selectedMonth+"&year="+thisScreen.selectedYear;
	$.get(url, function(data){
		var arr=JSON.parse(data);		
		
		var html=getLastUpdatedHtml();
		
		// BODY CONTENT
		var windowHeight=$(window).height()-125;		
		html+="<div id='map_canvas' style='width:100%; height:"+windowHeight+"px;'></div>";		
		thisScreen.GUI.find('.body').html(html);	

		// GOOGLE MAP
		$('#map_canvas').gmap().bind('init', function(ev, map) {
			for (var i=0; i<arr.length; i++){					
				var e=arr[i];
				if (e.lat!=undefined && e.lng!=undefined){
					thisScreen.addMarker(e);						
				}
			}
		});
		
		thisScreen.updateSetDateButton();
	});
}

mapScreen.activeEventHandlers=function(){
	var thisScreen=this;
	this.activeCommonEventHandlers();
}
mapScreen.disableEventHandlers=function(){
}