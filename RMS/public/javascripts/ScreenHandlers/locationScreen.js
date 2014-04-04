locationScreen=new Screen();
locationScreen.init=function(smName, prevScreen, mandantName){			
	this.GUI=$('#locationScreen');
	
	if (typeof prevScreen !== 'undefined'){
		this.prevScreen=prevScreen;			
	} else {
		this.GUI.find('.btBack').css('display','none');
	}
	this.supermandant=smName;
	if (typeof mandantName !== 'undefined' && mandantName!=""){
		this.mandant=mandantName;
		this.GUI.find('.screenTitle').html(LANGUAGE.LOCATION_VIEW+" ("+mandantName+" - "+smName+")");
	} else {		
		this.mandant="";
		this.GUI.find('.screenTitle').html(LANGUAGE.LOCATION_VIEW+" ("+smName+")");
	}
	
	this.initDate();	
}

locationScreen.reloadScreenBody=function(){
	var thisScreen=this;		
	$('#btViewActs').attr('disabled','disabled');
	
	var url="webservice/data/by_location?supermandant="+thisScreen.supermandant+"&mandant="+thisScreen.mandant+"&day="+thisScreen.selectedDay+"&month="+thisScreen.selectedMonth+"&year="+thisScreen.selectedYear;
	$.get(url, function(data){
		var arr=convertTreeToArray(JSON.parse(data));			
		
		var html=getLastUpdatedHtml();
		html+="<div id='locationListJS'>";
			html+=getListJsToolbarHtml();		
			
			html+='<div class="list">';						
			for (var i=0; i<arr.length; i++){
				var loc=arr[i];
				var tmpResponseTime=resFormat(loc['rt']);
				
				html+='<div class="divLocationData">';
				html+='	<span class="dataIndex">'+i+'</span>';
				html+='	<span class="dataName depth'+loc['depth']+' '+(tmpResponseTime>=3?"red":"")+'" fullName="'+loc['name']+'">'+paloDecode(loc['name'])+'</span>';
				html+='	<span class="dataNOR">'+reqFormat(loc['nor'])+'</span>';
				html+='	<span class="dataRT '+(tmpResponseTime>=3?"red":"")+' ">'+tmpResponseTime+'</span>';
				html+='</div>';									
			}
			html+='</div>'; 
		html+='</div>'; 
		
		thisScreen.GUI.find('.body').html(html);
		
		// ListJS
		var options = { valueNames: [ 'dataIndex', 'dataName', 'dataNOR' , 'dataRT'] };		
		thisScreen.listJS = new List('locationListJS', options);					
		
		thisScreen.updateSetDateButton();
		
	});
}

locationScreen.activeEventHandlers=function(){
	var thisScreen=this;
	thisScreen.activeCommonEventHandlers();
	
	$(document).on('click','.divLocationData',function(){
		if ( $(this).hasClass('selected') ){
			$(this).removeClass('selected');
			$('#btViewActs').attr('disabled','disabled');
		} else {
			$('.selected').each(function(){
				$(this).removeClass('selected');
			});									
			$(this).addClass('selected');
			$('#btViewActs').removeAttr('disabled');
			thisScreen.selectedLocation=$(this).children('.dataName').attr('fullName');
		}
	});
	$(document).on('click','#btViewActs',function(){
		thisScreen.hide();
		activityScreen.init(thisScreen.supermandant, thisScreen, thisScreen.selectedLocation, thisScreen.mandant);
		activityScreen.show();
	});
}
locationScreen.disableEventHandlers=function(){
	$(document).off('click','.divLocationData');
	$(document).off('click','#btViewActs');
}