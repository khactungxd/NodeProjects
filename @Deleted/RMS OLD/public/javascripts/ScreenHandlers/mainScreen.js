var mainScreen={
	// CLASS VARIABLES
	arrServerSuperMandants: [],
	arrAddedSuperMandants: [],
	intervalHandler: null,
	listJS:null,
	
	// CLASS METHODS
	init: function(){	
		var thisScreen=this;
		// TODO: LOAD ADDED SUPER MANDANTS FROM LOCAL STORAGE								
		if ( localStorage.getItem('arrAddedSuperMandants') )
			thisScreen.arrAddedSuperMandants=JSON.parse( localStorage.getItem('arrAddedSuperMandants') );				
		
		// GET MANDANTS LIST FROM SERVER
		$.get("supermandants", function(data){
			function superMandantExistInServer(element, index, array){				
				if (in_array( element, thisScreen.arrServerSuperMandants )) return true; else return false;				
			}
			thisScreen.arrServerSuperMandants = data;
			
			// Remove SM in arrAddedSM that doesn't exist in server sidebar
			thisScreen.arrAddedSuperMandants=thisScreen.arrAddedSuperMandants.filter(superMandantExistInServer);
			localStorage.setItem("arrAddedSuperMandants",JSON.stringify(thisScreen.arrAddedSuperMandants));
			
			thisScreen.generateMandantsDialog();											
		})
	},
	show: function(){
		currentScreen=this;
		$('#mainScreen').css('display','block');
		this.activeEventHandlers();
		this.reloadScreenBody();
	}, 
	hide: function(){
		$('#mainScreen').css('display','none');
		this.disableEventHandlers();
	},
	disableEventHandlers: function(){
		$(document).off('click','#btManageMandants');
		$(document).off('click','.btMandant');
		$(document).off('click','.btRefresh');
		$(document).off('click','.btSetInterval');
		$(document).off('click','.btIntervalValue');
		$(document).off('click','.btDetails');
		$(document).off('click','#btRemoveSm');
		$(document).off('click','#btLocationView');
		$(document).off('click','#btActivityView');
		$(document).off('click','#btMapView');
		$(document).off('click','#btChartView');
	}, 
	activeEventHandlers: function(){
		var thisScreen=this;
		
		$(document).on('click','#btManageMandants',function(){
			$("#dlgMandants").dialog();			
		});
		$(document).on('click','.btMandant', function(){ // button Mandant IN manage-mandants-dialog			
			var superMandantName=$(this).attr('superMandantName');
			if ($(this).attr('action')=="remove"){ // remove a mandant
				var index=thisScreen.arrAddedSuperMandants.indexOf(superMandantName);
				thisScreen.arrAddedSuperMandants.splice(index,1);
			} else { //add a mandant
				thisScreen.arrAddedSuperMandants.push(superMandantName);				
			}
			
			// MAKE ARRAY uniqueID
			thisScreen.arrAddedSuperMandants = thisScreen.arrAddedSuperMandants.reverse().filter(function (e, i, arr) {
				return arr.indexOf(e, i+1) === -1;
			}).reverse();
			
			// SAVE LIST OF ADDED SMANDANTS TO LOCAL STORAGE
			localStorage.setItem("arrAddedSuperMandants",JSON.stringify(thisScreen.arrAddedSuperMandants));
			
			$("#dlgMandants").dialog("close");			// CLOSE DIALOG
			thisScreen.generateMandantsDialog(); 	// prepare content for next-time open SM Dialog
			
			// RELOAD MAIN SCREEN BODY
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
				$('#mainScreen .btSetInterval').html("Set Interval ("+nMins+")");
			} else {
				clearInterval(thisScreen.intervalHandler);				
				$('#mainScreen .btSetInterval').html("Set Interval");
			}
		});
		$(document).on('click','.btDetails', function(){ 
			var smName=$(this).attr('smName');
			$('#btRemoveSm').attr('smName',smName);
			$('#btLocationView').attr('smName',smName);
			$('#btActivityView').attr('smName',smName);
			$('#btMapView').attr('smName',smName);
			$('#btChartView').attr('smName',smName);
			$("#dlgSmDetails").dialog( {width:270, title: smName} );
		});
		$(document).on('click','#btRemoveSm', function(){ 			
			var smName=$(this).attr('smName');							
			var index=thisScreen.arrAddedSuperMandants.indexOf(smName);
			thisScreen.arrAddedSuperMandants.splice(index,1);
			localStorage.setItem("arrAddedSuperMandants",JSON.stringify(thisScreen.arrAddedSuperMandants));
			thisScreen.generateMandantsDialog();
			$("#dlgSmDetails").dialog( "close" );
			thisScreen.reloadScreenBody();
		});
		$(document).on('click','#btLocationView', function(){ 
			var smName=$(this).attr('smName');			
			$("#dlgSmDetails").dialog( "close" );
			thisScreen.hide();			
			locationScreen.init(smName, thisScreen);
			locationScreen.show();		
		});
		$(document).on('click','#btActivityView', function(){ 
			var smName=$(this).attr('smName');			
			$("#dlgSmDetails").dialog( "close" );
			thisScreen.hide();
			activityScreen.init(smName, thisScreen);
			activityScreen.show();
		});
		$(document).on('click','#btMapView', function(){
			var smName=$(this).attr('smName');			
			$("#dlgSmDetails").dialog( "close" );			
			thisScreen.hide();
			mapScreen.init(smName, thisScreen);
			mapScreen.show();
		});
		$(document).on('click','#btChartView', function(){
			var smName=$(this).attr('smName');			
			$("#dlgSmDetails").dialog( "close" );			
			thisScreen.hide();
			chartScreen.init(smName, thisScreen);
			chartScreen.show();
		});
	},
	generateMandantsDialog: function(){
		var html="";
		for (var i=0;i<this.arrServerSuperMandants.length; i++){
			var added=false;
			for (var j=0;j<this.arrAddedSuperMandants.length; j++){
				if (this.arrAddedSuperMandants[j]==this.arrServerSuperMandants[i]) added=true;				
			}
			if (added){
				html+="<div style='height:40px;'><button action='remove' class='btMandant button' superMandantName='"+this.arrServerSuperMandants[i]+"'>"+this.arrServerSuperMandants[i]+" [REMOVE]</button></div>";
			} else {
				html+="<div style='height:40px;'><button action='add' class='btMandant button' superMandantName='"+this.arrServerSuperMandants[i]+"'>"+this.arrServerSuperMandants[i]+" [ADD]</button></div>";
			}
		}
		$('#dlgMandants').html(html);				
	},
	
	reloadScreenBody: function(){								
		var thisScreen=this;
		
		// APPEND HTML TO MAIN screen		
		var html="";
		
		// Notice if there is no mandant added
		if (thisScreen.arrAddedSuperMandants.length==0){
			html+="<div style='text-align:center; font-size:1.5em'>There is no mandants added ! Please use button at top right corner !</div>";;
		} else {		
			html+="<div id='divLastUpdate'>Last Updated: <span id='spanLastUpdate'></span></div>";
			html+="<div id='mainScreenListJS'>";			
				html+='<div class="list">';				
				for (var i=0; i<thisScreen.arrAddedSuperMandants.length; i++){			
					var smName=this.arrAddedSuperMandants[i];
					html+="<div class='divSM'>";
					html+="  <div class='divSmTitle'>"+smName+"</div><div class='divSmDetails'><button smName='"+smName+"' class='btDetails button'>Details</button></div><div style='clear:both'></div>";
					html+="  <div class='divSmData'>";
					html+="			<div class='smData'><span class='spanTodayTitle' smName='"+smName+"'>+ Today</span><span class='spanTodayRequests' smName='"+smName+"'>...</span><span class='spanTodayResponse' smName='"+smName+"'>...</span></div>";
					html+="			<div class='smData'><span class='spanThisMonthTitle' smName='"+smName+"'>+ This Month</span><span class='spanThisMonthRequests' smName='"+smName+"'>...</span><span class='spanThisMonthResponse' smName='"+smName+"'>...</span></div>";
					html+="			<div class='smData'><span class='spanThisYearTitle' smName='"+smName+"'>+ This Year</span><span class='spanThisYearRequests' smName='"+smName+"'>...</span><span class='spanThisYearResponse' smName='"+smName+"'>...</span></div>";
					html+="  </div>";
					html+="</div>";
				}
				html+='</div>'; // .list
			html+='</div>'; // #mainScreenListJS
		}
		
		$('#mainScreen .body').html(html);
		if (thisScreen.arrAddedSuperMandants.length>0){
			var options = {
				valueNames: [ 'spanTodayRequests', 'spanTodayResponse', 'spanThisMonthRequests', 'spanThisMonthResponse', 'spanThisYearRequests', 'spanThisYearResponse', ]
			};
			thisScreen.listJS = new List('mainScreenListJS', options);
		}
		
		// Send AJAX requests (recent_data)
		for (var i=0; i<thisScreen.arrAddedSuperMandants.length; i++){
			var smName=thisScreen.arrAddedSuperMandants[i];	
			thisScreen.getSmData(smName);
		}	
	},
	getSmData: function(smName){						
		$.get("recent_data?supermandant="+smName, function(data){			
			data=JSON.parse(data);					
			$('.spanTodayRequests[smName='+smName+']').html(reqFormat(data.today.number_of_requests));
			$('.spanThisMonthRequests[smName='+smName+']').html(reqFormat(data.this_month.number_of_requests));
			$('.spanThisYearRequests[smName='+smName+']').html(reqFormat(data.this_year.number_of_requests));
			
			// UPDATE SM VALUES and HIGHLIGHT if RESPONSE TIME > WARNING LIMIT
			var todayRes=resFormat(data.today.response_time);
				$('.spanTodayResponse[smName='+smName+']').html(todayRes);
				if (todayRes>3){ $('.spanTodayTitle[smName='+smName+']').addClass('red'); $('.spanTodayResponse[smName='+smName+']').addClass('red'); }
			var monthRes=resFormat(data.this_month.response_time);
				$('.spanThisMonthResponse[smName='+smName+']').html(monthRes);
				if (monthRes>3){ $('.spanThisMonthTitle[smName='+smName+']').addClass('red'); $('.spanThisMonthResponse[smName='+smName+']').addClass('red'); }
			var yearRes=resFormat(data.this_year.response_time);
				$('.spanThisYearResponse[smName='+smName+']').html(yearRes);
				if (yearRes>3){ $('.spanThisYearTitle[smName='+smName+']').addClass('red'); $('.spanThisYearResponse[smName='+smName+']').addClass('red'); }
			
			// Change LAST-UPDATE time
			var currentDate=new Date();
			var currentTime = twoDigits(currentDate.getDate()) + "."+ twoDigits(currentDate.getMonth()+1)  + "." + currentDate.getFullYear() + " @ "  + twoDigits(currentDate.getHours()) + ":"  + twoDigits(currentDate.getMinutes()) + ":" + twoDigits(currentDate.getSeconds());
			$('#spanLastUpdate').html(currentTime);			
		});
	}
}