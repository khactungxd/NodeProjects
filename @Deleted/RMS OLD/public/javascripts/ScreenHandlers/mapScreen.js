var mapScreen={
	// VARIABLES
	supermandant: "",
	intervalHandler: null,
	prevScreen: null,
	selectedDay:"",
	selectedMonth:"",
	selectedYear:"",	
	
	// METHODS
	init: function(smName, prevScreen){		
		if (typeof prevScreen !== 'undefined'){
			this.prevScreen=prevScreen;			
		} else {
			$('#mapScreen .btBack').css('display','none');
		}
		this.supermandant=smName;
		$('#mapScreen .screenTitle').html("Map View ("+smName+")");		
		$('#btViewActs').attr('disabled','disabled');
		
		// Preselect Date
		var currentDate=new Date();
		this.selectedDay=""; // Add Days
		this.selectedMonth=currentDate.getMonth()+1;
		this.selectedYear=currentDate.getFullYear();		
	},
	hide: function(){
		$('#mapScreen').css('display','none');
		this.disableEventHandlers();
	},
	show: function(){
		currentScreen=this;
		$('#mapScreen').css('display','block');
		this.activeEventHandlers();
		this.reloadScreenBody();
	},
	addMarker: function(e){		
		var color="green";
		if (e.response_time>=3) color="red";
		
		var imgUrl='images/markers/'+e.depth+color+'.png';
		var req=Number((parseFloat(e.number_of_requests)).toFixed(0));
		var res=Number((parseFloat(e.response_time)).toFixed(2));
		
		$('#map_canvas').gmap('addMarker', {'position': e.lat+' , '+e.lng ,'bounds': true, 'icon': imgUrl}).click(function() {
			$('#map_canvas').gmap('openInfoWindow', {'content': '<div class="markerTitle">'+e.name+'</div><table class="markerTable"><tr><td>Number of Requests</td><td>'+req+'</td></tr><tr><td>Response Time</td><td>'+res+'</td></tr></table>'}, this);
		});
	},
	reloadScreenBody: function(){
		var thisScreen=this;		
		$('#btViewActs').attr('disabled','disabled');
		
		var url="data_for_map?supermandant="+thisScreen.supermandant+"&day="+thisScreen.selectedDay+"&month="+thisScreen.selectedMonth+"&year="+thisScreen.selectedYear;		
		console.log(url);
		$.get(url, function(data){
			var arr=JSON.parse(data);			
			var html="";
			
			// Change LAST-UPDATE time
			var currentDate=new Date();
			var currentTime = currentDate.getDate() + "/"+ (currentDate.getMonth()+1)  + "/" + currentDate.getFullYear() + " @ "  + currentDate.getHours() + ":"  + currentDate.getMinutes() + ":" + currentDate.getSeconds();			
			html+="<div id='divLastUpdate' style='border-bottom:1px dotted black;'>Last Updated: <span id='spanLastUpdate'>"+currentTime+"</span></div>";
			
			// BODY CONTENT
			var windowHeight=$(window).height()-120;
			
			html+="<div id='map_canvas' style='width:100%; height:"+windowHeight+"px;'></div>";
			
			$('#mapScreen .body').html(html);	

			// GOOGLE MAP
			$('#map_canvas').gmap().bind('init', function(ev, map) {
				for (var i=0; i<arr.length; i++){					
					var e=arr[i];
					if (e.lat!=undefined && e.lng!=undefined){
						thisScreen.addMarker(e);						
					}
				}
			});
			
			// Change "Set-date-button" text (show selected date)
			var tmpDay=thisScreen.selectedDay!=""?(thisScreen.selectedDay>=10?thisScreen.selectedDay:"0"+thisScreen.selectedDay):"--";
			var tmpMonth=thisScreen.selectedMonth!=""?(thisScreen.selectedMonth>=10?thisScreen.selectedMonth:"0"+thisScreen.selectedMonth):"--";
			var tmpYear=thisScreen.selectedYear!=""?thisScreen.selectedYear:"--";
			$('#mapScreen .btSetDate').html("Set Date ( "+tmpDay+"."+tmpMonth+"."+tmpYear+" )");
			
		});
	},
	activeEventHandlers: function(){
		var thisScreen=this;
		$(document).on('click','.btBack',function(){
			thisScreen.hide();
			thisScreen.prevScreen.show();
		});
		$(document).on('click','.btSetDate',function(){
			var html=getSetDateHtml(thisScreen.selectedDay, thisScreen.selectedMonth, thisScreen.selectedYear );
			$('.dlgSetDate').html(html);
			$('.dlgSetDate').dialog();
		});
		$(document).on('click','#btSelectDate', function(){ 						
			thisScreen.selectedDay=$('#slDay').val();
			thisScreen.selectedMonth=$('#slMonth').val();
			thisScreen.selectedYear=$('#slYear').val();
			$(".dlgSetDate").dialog( "close" );
			thisScreen.reloadScreenBody();
		});
		$(document).on('click','.btRefresh', function(){ 	
			thisScreen.reloadScreenBody();
		});
		$(document).on('click','.btSetInterval', function(){ 	
			$(".dlgSetInterval").dialog( {width:200} );
		});
		$(document).on('click','.btIntervalValue', function(event){ 
			$(".dlgSetInterval").dialog("close");			
			var nMins=parseInt($(this).attr('mins'));
			if (nMins>0){
				thisScreen.intervalHandler=setInterval( function(){ thisScreen.reloadScreenBody(); } , nMins*60*1000 );
				$('#mapScreen .btSetInterval').html("Set Interval ("+nMins+")");
			} else {
				clearInterval(thisScreen.intervalHandler);				
				$('#mapScreen .btSetInterval').html("Set Interval");
			}
		});
						
		$(document).on('click','#btViewActs',function(){
			thisScreen.hide();
			activityScreen.init(thisScreen.supermandant, thisScreen, thisScreen.selectedLocation);
			activityScreen.show();
		});
	},
	disableEventHandlers: function(){
		$(document).off('click','.btBack');
		$(document).off('click','.btSetDate');
		$(document).off('click','#btSelectDate');
		$(document).off('click','.btRefresh');
		$(document).off('click','.btSetInterval');
		$(document).off('click','.btIntervalValue');		
		$(document).off('click','#btViewActs');
	}
}


