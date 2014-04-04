activityScreen=new Screen();

activityScreen.init=function(smName, prevScreen, selectedLocation, mandantName){
	this.GUI=$('#activityScreen');
	
	if (typeof prevScreen !== 'undefined'){
		this.prevScreen=prevScreen;			
	} else {
		this.GUI.find('.btBack').css('display','none');
	}
	this.supermandant=smName;
	if (typeof mandantName !== 'undefined' && mandantName!=""){
		this.mandant=mandantName;
		this.GUI.find('.screenTitle').html("Activity View ("+mandantName+" - "+smName+")");
	} else {		
		this.mandant="";
		this.GUI.find('.screenTitle').html("Activity View ("+smName+")");
	}

	if (typeof selectedLocation !== 'undefined') this.selectedLocation=selectedLocation; 
		else this.selectedLocation="Globe"; 
		
	this.initDate();		
}

activityScreen.reloadScreenBody= function(){
	var thisScreen=this;		
	thisScreen.GUI.find('.btSetLocation').attr('disabled','disabled');
	
	var url="webservice/data/by_activity?supermandant="+thisScreen.supermandant+"&mandant="+thisScreen.mandant+"&day="+thisScreen.selectedDay+"&month="+thisScreen.selectedMonth+"&year="+thisScreen.selectedYear+"&location="+thisScreen.selectedLocation;
	$.get(url, function(data){
		var arr=convertTreeToArray(JSON.parse(data));			
		
		var html=getLastUpdatedHtml();
		html+="<div id='activityListJS'>";
			html+=getListJsToolbarHtml();	
			
			html+='<div class="list">';			
			for (var i=0; i<arr.length; i++){
				var act=arr[i];
				var tmpResponseTime=resFormat(act['rt']);
				
				html+='<div class="divActivityData">';
				html+='	<span class="dataIndex">'+i+'</span>';
				html+='	<span class="dataName depth'+act['depth']+' '+(tmpResponseTime>=3?"red":"")+' " fullName="'+act['name']+'">'+paloDecode(act['name'])+'</span>';
				html+='	<span class="dataNOR">'+reqFormat(act['nor'])+'</span>';
				html+='	<span class="dataRT '+(tmpResponseTime>=3?"red":"")+' ">'+tmpResponseTime+'</span>';
				html+='</div>';									
			} 
			html+='</div>'; 
		html+="</div>"; 
		
		thisScreen.GUI.find('.body').html(html);
		
		// LIST JS
		var options = {valueNames: [ 'dataIndex', 'dataName', 'dataNOR' , 'dataRT']};		
		thisScreen.listJS = new List('activityListJS', options);			
		
		thisScreen.updateSetDateButton();
						
		// Get Location List And Update Set-Location-dialog
		$.get("webservice/location/list", function(data){
			var arrLocations=convertTreeToArray(JSON.parse(data));		
			
			// Update Set-Location-dialog
			var html="<p style='width:100%; background:yellow; text-align:left; margin: 0px !important; padding: 0px; '>";
			for (var i=0; i<arrLocations.length; i++){
				var marginLeft=arrLocations[i]['depth']*30+10;
				html+="<div style='margin-left:"+marginLeft+"px; '><button class='btLocationInDialog' style='min-width:80px;' fullName='"+arrLocations[i]['name']+"' >"+paloDecode(arrLocations[i]['name'])+"</button></div>";
			}
			html+="</p>";
			
			$('.dlgSetLocation').html(html);
			thisScreen.GUI.find('.btSetLocation').removeAttr('disabled');
			
			// Change "Set-location-button" text (show selected location)
			thisScreen.GUI.find('.btSetLocation').html(LANGUAGE.LOCATION+" ( "+thisScreen.selectedLocation+" )");
		});
					
	});
}

activityScreen.activeEventHandlers=function(){
	var thisScreen=this;
	thisScreen.activeCommonEventHandlers();
		
	$(document).on('click','.btSetLocation',function(){
		$(".dlgSetLocation").dialog( {title: LANGUAGE.LOCATION ,width:460, height:460} );
	});		
	$(document).on('click','.divActivityData',function(){
		if ( $(this).hasClass('selected') ){
			$(this).removeClass('selected');
		} else {
			$('.selected').each(function(){
				$(this).removeClass('selected');
			});					
			
			$(this).addClass('selected');
		}
	});
	$(document).on('click','.btLocationInDialog',function(){
		thisScreen.selectedLocation=$(this).attr('fullName');
		$(".dlgSetLocation").dialog("close");
		thisScreen.reloadScreenBody();
	});
}
activityScreen.disableEventHandlers=function(){
	$(document).off('click','.btSetLocation');
	$(document).off('click','.divActivityData');
	$(document).off('click','.btLocationInDialog');
}
