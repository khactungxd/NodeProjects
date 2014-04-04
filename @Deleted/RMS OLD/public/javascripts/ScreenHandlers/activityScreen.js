var activityScreen={
	// VARIABLES
	supermandant: "",
	intervalHandler: null,
	prevScreen: null,
	selectedLocation:"",
	selectedDay:"",
	selectedMonth:"",
	selectedYear:"",
	listJS:null,
	
	// METHODS
	init: function(smName, prevScreen, selectedLocation){		
		if (typeof prevScreen !== 'undefined'){
			this.prevScreen=prevScreen;			
		} else {
			$('#activityScreen .btBack').css('display','none');
		}
		this.supermandant=smName;
		$('#activityScreen .screenTitle').html("Activity View ("+smName+")");		
		
		if (typeof selectedLocation !== 'undefined') this.selectedLocation=selectedLocation; 
			else this.selectedLocation="Globe"; 
			
		// Preselect Date
		var currentDate=new Date();						
		this.selectedDay=""; // Add Days
		this.selectedMonth=currentDate.getMonth()+1;
		this.selectedYear=currentDate.getFullYear();		
	},
	hide: function(){
		$('#activityScreen').css('display','none');
		this.disableEventHandlers();
	},
	show: function(){
		currentScreen=this;
		$('#activityScreen').css('display','block');
		this.activeEventHandlers();
		this.reloadScreenBody();
	},
	reloadScreenBody: function(){
		var thisScreen=this;		
		$('#activitiyScreen .btSetLocation').attr('disabled','disabled');
		
		var url="data_by_activity?supermandant="+thisScreen.supermandant+"&day="+thisScreen.selectedDay+"&month="+thisScreen.selectedMonth+"&year="+thisScreen.selectedYear+"&location="+thisScreen.selectedLocation;		
		$.get(url, function(data){
			console.log(data);
			var arr=convertTreeToArray(JSON.parse(data));			
			var html="";
			
			// Change LAST-UPDATE time
			var currentDate=new Date();
			var currentTime = currentDate.getDate() + "/"+ (currentDate.getMonth()+1)  + "/" + currentDate.getFullYear() + " @ "  + currentDate.getHours() + ":"  + currentDate.getMinutes() + ":" + currentDate.getSeconds();
			html+="<div id='divLastUpdate' style='border-bottom:1px dotted black;'>Last Updated: <span id='spanLastUpdate'>"+currentTime+"</span></div>";
			html+="<div id='activityListJS'>";
			html+='<div id="listJsToolbar"><span id="listJsSearchBox"><input class="search" placeholder="Search" /></span><span id="listJsFilterArea"><button id="btListJsFilter">Res>=3</button><button id="btListJsRemoveFilter"  style="display:none">Remove Filter</button></span></div>';
			//<span class="sort" data-sort="spanActivityIndex">Sort by spanActivityName</span>';
			html+='<div class="list">';
			
			for (var i=0; i<arr.length; i++){
				var act=arr[i];
				var tmpResponseTime=resFormat(act['rt']);
				
				html+='<div class="divActivityData">';
				html+='<span style="display:none" class="spanActivityIndex">'+i+'</span>';
				html+='<span class="spanActivityName depth'+act['depth']+' '+(tmpResponseTime>=3?"red":"")+' ">'+act['name']+'</span>';
				html+='<span class="spanActivityNOR">'+reqFormat(act['nor'])+'</span>';
				html+='<span class="spanActivityRT '+(tmpResponseTime>=3?"red":"")+' ">'+tmpResponseTime+'</span>';
				html+='</div>';									
			}
			html+='</div>'; // #divActivityData
			html+="</div>"; // #listJS
			
			$('#activityScreen .body').html(html);
			var options = {
				valueNames: [ 'spanActivityIndex', 'spanActivityName', 'city' , 'spanActivityRT']
			};		
			thisScreen.listJS = new List('activityListJS', options);			
			
			
			// Change "Set-date-button" text (show selected date)
			var tmpDay=thisScreen.selectedDay!=""?(thisScreen.selectedDay>=10?thisScreen.selectedDay:"0"+thisScreen.selectedDay):"--";
			var tmpMonth=thisScreen.selectedMonth!=""?(thisScreen.selectedMonth>=10?thisScreen.selectedMonth:"0"+thisScreen.selectedMonth):"--";
			var tmpYear=thisScreen.selectedYear!=""?thisScreen.selectedYear:"--";
			$('#activityScreen .btSetDate').html("Date ( "+tmpDay+"."+tmpMonth+"."+tmpYear+" )");
			
			
			
			// Get Location List And Update Set-Location-dialog
			$.get("locations", function(data){
				var arrLocations=convertTreeToArray(JSON.parse(data));		
				
				// Update Set-Location-dialog
				var html="<p style='width:100%; background:yellow; text-align:left; margin: 0px !important; padding: 0px; '>";
				for (var i=0; i<arrLocations.length; i++){
					var marginLeft=arrLocations[i]['depth']*30+10;
					html+="<div style='margin-left:"+marginLeft+"px; '><button class='btLocationInDialog' style='min-width:80px; '>"+arrLocations[i]['name']+"</button></div>";
				}
				html+="</p>";
				
				$('.dlgSetLocation').html(html);
				$('#activitiyScreen .btSetLocation').removeAttr('disabled');
				
				// Change "Set-location-button" text (show selected location)
				$('#activityScreen .btSetLocation').html("Location ( "+thisScreen.selectedLocation+" )");
			});
						
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
		$(document).on('click','.btSetLocation',function(){
			$(".dlgSetLocation").dialog( {width:460} );
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
				$('#activityScreen .btSetInterval').html("Interval ("+nMins+")");
			} else {
				clearInterval(thisScreen.intervalHandler);				
				$('#activityScreen .btSetInterval').html("Interval");
			}
		});
		$(document).on('click','#btListJsFilter',function(){
			thisScreen.listJS.filter(function(item) {
			   if (item.values().spanActivityRT >= 3) {
				   return true;
			   } else {
				   return false;
			   }
			});
			
			$('#btListJsFilter').css('display','none');
			$('#btListJsRemoveFilter').css('display','block');
		});
		$(document).on('click','#btListJsRemoveFilter',function(){
			thisScreen.listJS.filter();
			
			$('#btListJsFilter').css('display','block');
			$('#btListJsRemoveFilter').css('display','none');
		});
		$(document).on('click','.divActivityData',function(){
			if ( $(this).hasClass('rowSelected') ){
				$(this).removeClass('rowSelected');
			} else {
				$('.rowSelected').each(function(){
					$(this).removeClass('rowSelected');
				});					
				
				$(this).addClass('rowSelected');
			}
		});
		$(document).on('click','.btLocationInDialog',function(){
			thisScreen.selectedLocation=$(this).html();			
			$(".dlgSetLocation").dialog("close");
			thisScreen.reloadScreenBody();
		});
	},
	disableEventHandlers: function(){
		$(document).off('click','.btBack');
		$(document).off('click','.btSetDate');
		$(document).off('click','.btSetLocation');
		$(document).off('click','#btSelectDate');
		$(document).off('click','.btRefresh');
		$(document).off('click','.btSetInterval');
		$(document).off('click','.btIntervalValue');
		$(document).off('click','#btListJsFilter');
		$(document).off('click','#btListJsRemoveFilter');
		$(document).off('click','.btLocationInDialog');
	}
}
