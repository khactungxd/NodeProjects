// ==== GLOBAL INIT ====
$(function(){
	var prevScreen;
	currentScreen=mainScreen; // global var
	mainScreen.init();
	mainScreen.show();	

	// === GLOBAL EVENT HANDLERS
	$('.dialog').bind('dialogopen', function(event) { // close any dialog box
		$('#grey').css('display','block');
	});
	$('.dialog').bind('dialogclose', function(event) { // close any dialog box
		$('#grey').css('display','none');
	});
	
	$(window).resize(function() {
		currentScreen.reloadScreenBody();
	});
});


