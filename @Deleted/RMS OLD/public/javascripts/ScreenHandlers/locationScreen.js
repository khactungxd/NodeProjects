var locationScreen={
	// VARIABLES
	supermandant: "",
	intervalHandler: null,
	prevScreen: null,
	selectedDay:"",
	selectedMonth:"",
	selectedYear:"",
	selectedLocation:"", 
	listJS:null,
	
	// METHODS
	init: function(smName, prevScreen){		
		if (typeof prevScreen !== 'undefined'){
			this.prevScreen=prevScreen;			
		} else {
			$('#locationScreen .btBack').css('display','none');
		}
		this.supermandant=smName;
		$('#locationScreen .screenTitle').html("Location View ("+smName+")");
		$('#btViewActs').attr('disabled','disabled');
		
		// Preselect Date
		var currentDate=new Date();
		this.selectedDay=""; // Add Days
		this.selectedMonth=currentDate.getMonth()+1;
		this.selectedYear=currentDate.getFullYear();		
	},
	hide: function(){
		$('#locationScreen').css('display','none');
		this.disableEventHandlers();
	},
	show: function(){
		currentScreen=this;
		$('#locationScreen').css('display','block');
		this.activeEventHandlers();
		this.reloadLocationScreenBody();
	},
	reloadLocationScreenBody: function(){
		var thisScreen=this;		
		$('#btViewActs').attr('disabled','disabled');
		
		var url="data_by_location?supermandant="+thisScreen.supermandant+"&day="+thisScreen.selectedDay+"&month="+thisScreen.selectedMonth+"&year="+thisScreen.selectedYear;		
		$.get(url, function(data){
			var arr=convertTreeToArray(JSON.parse(data));			
			var html="";
			
			// Change LAST-UPDATE time
			var currentDate=new Date();
			var currentTime = currentDate.getDate() + "/"+ (currentDate.getMonth()+1)  + "/" + currentDate.getFullYear() + " @ "  + currentDate.getHours() + ":"  + currentDate.getMinutes() + ":" + currentDate.getSeconds();
			html+="<div id='divLastUpdate' style='border-bottom:1px dotted black;'>Last Updated: <span id='spanLastUpdate'>"+currentTime+"</span></div>";
			html+="<div id='locationListJS'>";
			html+='<div id="listJsToolbar"><span id="listJsSearchBox"><input class="search" placeholder="Search" /></span><span id="listJsFilterArea"><button id="btListJsFilter">Res>=3</button><button id="btListJsRemoveFilter" style="display:none">Remove Filter</button></span></div>';
			//<span class="sort" data-sort="spanLocationIndex">Sort by spanLocationName</span>';
			html+='<div class="list">';			
			
			for (var i=0; i<arr.length; i++){
				var loc=arr[i];
				var tmpResponseTime=resFormat(loc['rt']);
				
				html+='<div class="divLocationData">';
				html+='<span style="display:none" class="spanLocationIndex">'+i+'</span>';
				html+='<span class="spanLocationName depth'+loc['depth']+' '+(tmpResponseTime>=3?"red":"")+' ">'+loc['name']+'</span>';
				html+='<span class="spanLocationNOR">'+reqFormat(loc['nor'])+'</span>';
				html+='<span class="spanLocationRT '+(tmpResponseTime>=3?"red":"")+' ">'+tmpResponseTime+'</span>';
				html+='</div>';									
			}
			html+='</div>'; // .list
			html+='</div>'; // #locationListJS
			
			$('#locationScreen .body').html(html);
			var options = {
				valueNames: [ 'spanLocationIndex', 'spanLocationName', 'spanLocationNOR' , 'spanLocationRT']
			};		
			thisScreen.listJS = new List('locationListJS', options);			
			
			
			// Change "Set-date-button" text (show selected date)
			var tmpDay=thisScreen.selectedDay!=""?(thisScreen.selectedDay>=10?thisScreen.selectedDay:"0"+thisScreen.selectedDay):"--";
			var tmpMonth=thisScreen.selectedMonth!=""?(thisScreen.selectedMonth>=10?thisScreen.selectedMonth:"0"+thisScreen.selectedMonth):"--";
			var tmpYear=thisScreen.selectedYear!=""?thisScreen.selectedYear:"--";
			$('#locationScreen .btSetDate').html("Date ( "+tmpDay+"."+tmpMonth+"."+tmpYear+" )");
			
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
			thisScreen.reloadLocationScreenBody();
		});
		$(document).on('click','.btRefresh', function(){ 	
			thisScreen.reloadLocationScreenBody();
		});
		$(document).on('click','.btSetInterval', function(){ 	
			$(".dlgSetInterval").dialog( {width:200} );
		});
		$(document).on('click','.btIntervalValue', function(event){ 
			$(".dlgSetInterval").dialog("close");			
			var nMins=parseInt($(this).attr('mins'));
			if (nMins>0){
				thisScreen.intervalHandler=setInterval( function(){ thisScreen.reloadLocationScreenBody(); } , nMins*60*1000 );
				$('#locationScreen .btSetInterval').html("Interval ("+nMins+")");
			} else {
				clearInterval(thisScreen.intervalHandler);				
				$('#locationScreen .btSetInterval').html("Interval");
			}
		});
		$(document).on('click','#btListJsFilter',function(){
			thisScreen.listJS.filter(function(item) {
			   if (item.values().spanLocationRT >= 3) {
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
		$(document).on('click','.divLocationData',function(){
			if ( $(this).hasClass('rowSelected') ){
				$(this).removeClass('rowSelected');
				$('#btViewActs').attr('disabled','disabled');
			} else {
				$('.rowSelected').each(function(){
					$(this).removeClass('rowSelected');
				});									
				$(this).addClass('rowSelected');
				$('#btViewActs').removeAttr('disabled');
				thisScreen.selectedLocation=$(this).children('.spanLocationName').html();				
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
		$(document).off('click','#btListJsFilter');
		$(document).off('click','#btListJsRemoveFilter');
		$(document).off('click','.divLocationData');
		$(document).off('click','#btViewActs');
	}
}


