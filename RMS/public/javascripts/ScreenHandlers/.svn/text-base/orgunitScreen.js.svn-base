orgunitScreen=new Screen();

orgunitScreen.init=function(smName, prevScreen, mandantName){	
	this.GUI=$('#orgunitScreen');
	
	if (typeof prevScreen !== 'undefined'){
		this.prevScreen=prevScreen;			
	} else {
		this.GUI.find('.btBack').css('display','none');
	}
	this.supermandant=smName;
	if (typeof mandantName !== 'undefined' && mandantName!=""){
		this.mandant=mandantName;
		this.GUI.find('.screenTitle').html("Orgunit View ("+mandantName+" - "+smName+")");
	} else {	
		this.mandant="";
		this.GUI.find('.screenTitle').html("Orgunit View ("+smName+")");
	}
	
	this.initDate();
}

orgunitScreen.reloadScreenBody=function(){
	var thisScreen=this;		
	
	var url="webservice/data/by_orgunit?supermandant="+thisScreen.supermandant+"&mandant="+thisScreen.mandant+"&day="+thisScreen.selectedDay+"&month="+thisScreen.selectedMonth+"&year="+thisScreen.selectedYear;
	$.get(url, function(data){
		var arr=convertTreeToArray(JSON.parse(data));
		
		var html=getLastUpdatedHtml();
		html+="<div id='orgunitListJS'>";
			html+=getListJsToolbarHtml();	
			
			html+='<div class="list">';						
			for (var i=0; i<arr.length; i++){
				var orgunit=arr[i];
				if (orgunit.depth==0) continue;
				var depthIndent=0;				
				if (thisScreen.mandant){
					if (orgunit.depth==1) continue;
					depthIndent=orgunit['depth']-2;
				} else {
					depthIndent=orgunit['depth']-1;
				}
				
				var tmpResponseTime=resFormat(orgunit['rt']);
				
				html+='<div class="divOrgunitData">';	
				html+='	<span class="dataName depth'+depthIndent+' '+(tmpResponseTime>=3?"red":"")+' ">'+paloDecode(orgunit['name'])+'</span>';
				html+='	<span class="dataNOR">'+reqFormat(orgunit['nor'])+'</span>';
				html+='	<span class="dataRT '+(tmpResponseTime>=3?"red":"")+' ">'+tmpResponseTime+'</span>';
				html+='</div>';									
			}
			html+='</div>';
		html+='</div>'; 
		
		thisScreen.GUI.find('.body').html(html);
		
		// LIST JS
		var options = {valueNames: [ 'dataName', 'dataNOR' , 'dataRT']};		
		thisScreen.listJS = new List('orgunitListJS', options);						
		
		thisScreen.updateSetDateButton();
	});
}

orgunitScreen.activeEventHandlers=function(){
	var thisScreen=this;
	this.activeCommonEventHandlers();
	
	$(document).on('click','.divOrgunitData',function(){
		if ( $(this).hasClass('selected') ){
			$(this).removeClass('selected');
		} else {
			$('.selected').each(function(){
				$(this).removeClass('selected');
			});					
			
			$(this).addClass('selected');
		}
	});		
}

orgunitScreen.disableEventHandlers=function(){
	$(document).off('click','.divOrgunitData');
}