$(function(){	
	handleLanguage();	
	loadGlobalEventHandler();
	
	currentScreen=mainScreen;
	mainScreen.init();
	mainScreen.show();			
});

function handleLanguage(){
	// GET LANGUAGE FROM AMPLIFYJS / USER AGENT
	// Priority: URL PARAMETER > LOCAL STORAGE > USER BROWSER
	if (QueryString.language){	
		LANGUAGE.__init(QueryString.language);
	} else if (amplify.store("oxseed_language")){		
		LANGUAGE.__init(amplify.store("oxseed_language"));
	} else {
		var browserLanguage = navigator.language || navigator.userLanguage; 
		browserLanguage=browserLanguage.substring(0,2);
		LANGUAGE.__init(browserLanguage);
	}
	
	// CHANGE SCREEN LANGUAGE (FIXED ELEMENGS)
	$('.btRefresh').html(LANGUAGE.REFRESH);
	$('.btSetInterval').html(LANGUAGE.INTERVAL);
	$('#btManageMandants').html(LANGUAGE.MANDANTS);
	$('#btSmDetails').html(LANGUAGE.DETAILS);	
	$('#btLocationView').html(LANGUAGE.LOCATION_VIEW);
	$('#btActivityView').html(LANGUAGE.ACTIVITY_VIEW);
	$('#btOrgunitView').html(LANGUAGE.ORGUNIT_VIEW);
	$('#btMapView').html(LANGUAGE.MAP_VIEW);
	$('#btChartView').html(LANGUAGE.CHART_VIEW);
	$('#btRemoveSm').html(LANGUAGE.REMOVE);
	$('.btBack').html(LANGUAGE.BACK);	
	$('#btViewActs').html(LANGUAGE.ACTIVITY_VIEW);	
	$('.btSetDate').html(LANGUAGE.DATE);	
	
	$('.btIntervalValue[mins=0]').html("Clear");	
	$('.btIntervalValue[mins=1]').html("1 "+LANGUAGE.MINUTE);	
	$('.btIntervalValue[mins=5]').html("5 "+LANGUAGE.MINUTES);	
	$('.btIntervalValue[mins=10]').html("10 "+LANGUAGE.MINUTES);	
	$('.btIntervalValue[mins=30]').html("30 "+LANGUAGE.MINUTES);		
	
	// $('').html(LANGUAGE.);	
}

function loadGlobalEventHandler(){
	$('.dialog').bind('dialogopen', function(event) { // close any dialog box
		$('#grey').css('display','block');
	});
	$('.dialog').bind('dialogclose', function(event) { // close any dialog box
		$('#grey').css('display','none');
	});
	$(window).resize(function() {
		currentScreen.reloadScreenBody();
	});			
}