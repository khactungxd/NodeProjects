// CLASS: SCREEN

Screen = function() {  
	// VARIABLES		
	var intervalHandler;
	var listJS;	
	var GUI;
	
	this.initDate=function(){
		var currentDate=new Date();
		this.selectedDay=""; 
		this.selectedMonth=currentDate.getMonth()+1;
		this.selectedYear=currentDate.getFullYear();	
	}	
	this.show=function(){				
		currentScreen=this;
		this.GUI.css('display','block');		
		this.activeEventHandlers();
		this.reloadScreenBody();
	}
	this.hide=function(){
		this.GUI.css('display','none');
		this.disableEventHandlers();
		this.disableCommonEventHandlers();
	}
	this.activeCommonEventHandlers=function(){		
		var thisScreen=this;
		
		$(document).on('click','.btRefresh', function(){ 		
			thisScreen.reloadScreenBody();
		});
		$(document).on('click','.btSetInterval', function(){ 
			$(".dlgSetInterval").dialog( {title:LANGUAGE.INTERVAL, width:200} );
		});	
		$(document).on('click','.btIntervalValue', function(event){ 
			$(".dlgSetInterval").dialog("close");			
			var nMins=parseInt($(this).attr('mins'));
			if (nMins>0){
				thisScreen.intervalHandler=setInterval( function(){ thisScreen.reloadScreenBody(); } , nMins*60*1000 );
				thisScreen.GUI.find('.btSetInterval').html(LANGUAGE.INTERVAL+" ("+nMins+")");
			} else {
				clearInterval(thisScreen.intervalHandler);				
				thisScreen.GUI.find('.btSetInterval').html(LANGUAGE.INTERVAL);
			}
		});
		$(document).on('click','.btBack',function(){
			thisScreen.hide();
			thisScreen.prevScreen.show();
		});
		$(document).on('click','.btSetDate',function(){
			var html=getSetDateHtml(thisScreen.selectedDay, thisScreen.selectedMonth, thisScreen.selectedYear ); //from helper file
			$('.dlgSetDate').html(html);
			$('.dlgSetDate').dialog({title:LANGUAGE.DATE});
		});
		$(document).on('click','#btSelectDate', function(){ 						
			thisScreen.selectedDay=$('#slDay').val();
			thisScreen.selectedMonth=$('#slMonth').val();
			thisScreen.selectedYear=$('#slYear').val();
			$(".dlgSetDate").dialog( "close" );
			thisScreen.reloadScreenBody();
		});	

		// === LIST JS ===
		$(document).on('click','.btListJsFilter',function(){
			thisScreen.listJS.filter(function(item) {
			   if (item.values().spanLocationRT >= 3) {
				   return true;
			   } else {
				   return false;
			   }
			});			
			$('.btListJsFilter').css('display','none');
			$('.btListJsRemoveFilter').css('display','block');
		});
		$(document).on('click','.btListJsRemoveFilter',function(){
			thisScreen.listJS.filter();
			$('.btListJsFilter').css('display','block');
			$('.btListJsRemoveFilter').css('display','none');
		});
	}
	this.disableCommonEventHandlers=function(){	
		$(document).off('click','.btRefresh');
		$(document).off('click','.btSetInterval');
		$(document).off('click','.btIntervalValue');
		$(document).off('click','.btBack');
		$(document).off('click','.btSetDate');
		$(document).off('click','#btSelectDate');
		
		$(document).off('click','.btListJsFilter');
		$(document).off('click','.btListJsRemoveFilter');
	}
	
	this.updateSetDateButton=function(){		
		var tmpDay=this.selectedDay!=""?(this.selectedDay>=10?this.selectedDay:"0"+this.selectedDay):"--";
		var tmpMonth=this.selectedMonth!=""?(this.selectedMonth>=10?this.selectedMonth:"0"+this.selectedMonth):"--";
		var tmpYear=this.selectedYear!=""?this.selectedYear:"--";
		this.GUI.find('.btSetDate').html(LANGUAGE.DATE+" ( "+tmpDay+"."+tmpMonth+"."+tmpYear+" )");
	}
}