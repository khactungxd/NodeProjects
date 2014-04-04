var date = new Date();
var hour = date.getHours();
var minute = date.getMinutes();
var day = date.getUTCDate();
var month = date.getUTCMonth()+1;
var year = date.getUTCFullYear();
var second = date.getSeconds();

$(document).ready(function(){
	$(".refresh").click(function(){
		refresh();
	})
	setInter();
	$(".datetime").html('<h1>Update'+hour+':'+minute+':'+second+'  '+month+'-'+day+'-'+year+'</h1>');
});

function setInter(){
	$('.setInterval').click(function(){
		$('#main #setInterval').html('<h2>Set Interval :'+$(this).text()+'</h2>');
		$('#interval').dialog("close");
		if($(this).text()=="5 Minutes"){
			stopInterval();
			startInterval(1000);
			setInter();
		}else if($(this).text()=="10 Minutes"){
			stopInterval();
			startInterval(2000);
			setInter();
		}else if($(this).text()=="30 Minutes"){
			stopInterval();
			startInterval(3000);
			setInter();
		}else if($(this).text()=="60 Minutes"){
			stopInterval();
			startInterval(4000);
			setInter();
		}else {
			stopInterval();
			setInter();
		}
	});
 }
 
var interval;

function startInterval(time) {
	interval = setInterval(function(){startTime()}, time);
}

function startTime() {
   refresh();
}

function stopInterval() {
	clearInterval(interval);
}
 
var refresh = function(){
	var new_date = new Date();
	var new_hour = new_date.getHours();
	var new_minute = new_date.getMinutes();
	var new_day = new_date.getUTCDate();
	var new_month = new_date.getUTCMonth()+1;
	var new_year = new_date.getUTCFullYear();
	var new_second = new_date.getSeconds();
	$(".datetime").html('<h1>Update'+new_hour+':'+new_minute+':'+new_second+'  '+new_month+'-'+new_day+'-'+new_year+'</h1>');
	$('#listing').hide();
	$('#listing').html('');
	var arr = new Array();
	$("#info p").each(function(){
		var supermandant=$(this).text();
		$.get("/recent_data?supermandant="+supermandant,function(data){	
			var arr =JSON.parse(data);
			$("#main #listing").append("<table id='view-"+supermandant+"' width='500px' style='background:none;margin-top:20px;'><tr><th><p style='float:left;width:30px;margin-left:30px;' >"+supermandant+"</p><img class='info supermandantBtn' src='/images/info.png' style='width:25px;'></img></th><th>Number Of Request</th><th>Response Time</th></tr><tr><td>This day:</td><td>"+arr.today.number_of_requests+"</td><td>"+arr.today.response_time+"</td></tr><tr><td>This month:</td><td>"+arr.this_month.number_of_requests+"</td><td>"+arr.this_month.response_time+"</td></tr><tr><td>This year:</td><td>"+arr.this_year.number_of_requests+"</td><td>"+arr.this_year.response_time+"</td></tr><table>");
			clickInfo();
		});
	});
	$('#listing').show();
}
