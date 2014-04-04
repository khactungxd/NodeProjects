/*
 $(function() {
 
    $( "#spinner" ).spinner({
      spin: function( event, ui ) {
        if ( ui.value > 10 ) {
          $( this ).spinner( "value", -10 );
          return false;
        } else if ( ui.value < -10 ) {
          $( this ).spinner( "value", 10 );
          return false;
        }
      }
    });
  });
  */
$(function() {
	$( "#dialog" ).dialog({
		  autoOpen: false
		,  modal: true
	});
	$.get("/supermandants",function(data){	
		for(var i=0;i<data.length;i++){
			$("#dialog").append("<p style='text-align:center'><a  style='width:150px;' class='supermandant button' >"+data[i]+"</a></p>");
		};
		$("#dialog").append("<p style='text-align:center'><a  style='width:150px;' class='cancel button'>Cancel</a></p>");
		appendContent();
		$( ".btnAdd" ).click(function() {
			$( "#dialog" ).dialog( "open" );
			cancel();
		});
	});

	$( "#interval" ).dialog({
		  autoOpen: false
		,  modal: true
	});	
	$( ".interval" ).click(function() {
			$( "#interval" ).dialog( "open" );
	});
});
	
function appendContent(){
	$(".supermandant").click(function(){
		var supermandant = $(this).text();
		$.get("/recent_data?supermandant="+supermandant,function(data){	
			var arr =JSON.parse(data);
			$("#main #listing").append("<table id='view-"+supermandant+"' width='500px' style='background:none;margin-top:20px;'><tr><th><p style='float:left;width:30px;margin-left:30px;' >"+supermandant+"</p><img class='info supermandantBtn' src='/images/info.png' style='width:25px;'></img></th><th>Number Of Request</th><th>Response Time</th></tr><tr><td>This day:</td><td>"+arr.today.number_of_requests+"</td><td>"+arr.today.response_time+"</td></tr><tr><td>This month:</td><td>"+arr.this_month.number_of_requests+"</td><td>"+arr.this_month.response_time+"</td></tr><tr><td>This year:</td><td>"+arr.this_year.number_of_requests+"</td><td>"+arr.this_year.response_time+"</td></tr><table>");
			$("#info .submandant").append('<p class="mandant">'+supermandant+'</p>');
			clickInfo();
			$( "#dialog" ).dialog("close");
		});
	})
}
 
function clickInfo(){
	$(".supermandantBtn").click(function(){
		var supermandant =$(this).parent().find('p').text();
		$("#view-info").html('<p style="text-align:center"><a class="remove button" style="width:150px">Remove<a></p><p  style="text-align:center"><a class="button location" style="width:150px">Location View</a></p><p  style="text-align:center"><a class="button activity" style="width:150px">Activity View</a></p><p  style="text-align:center"><a class="button mapview" style="width:150px">Map View</a></p><p  style="text-align:center"><a class="button cancel" style="width:150px">Cancel</a></p>');
		$( "#view-info" ).dialog({
		  autoOpen: false
		 , modal: true
		});
		$( "#view-info" ).dialog( "open" );
		clickLocation(supermandant);
		clickActivity(supermandant);
		mapviewClick(supermandant);
		cancel();
		remove(supermandant);
	});
 }
 /*
	INFO TABLE
 */
 function clickLocation(supermandant){
	$(".location").click(function(){
		$( "#view-info" ).dialog( "close" );
		$('#content').hide();
		loadLocation(supermandant,"undefined","undefined","undefined");
	});
}
function clickActivity(supermandant){
	$(".activity").click(function(){
		$( "#view-info" ).dialog( "close" );
		$('#content').hide();
		loadActivity(supermandant);
	});
}
function loadActLocation(supermandant){
	$(".btnViewAct").click(function(){
		$('#content1').hide();
		loadActivity(supermandant,year,month,day);
	});
}
function backClick(){
	$(".back1").click(function(){
		
		$('#content1').hide();
		$('#content').show();
	});
	$(".back2").click(function(){
		$('#content2').hide();
		$('#content').show();
	});
	$(".back3").click(function(){
		$('#content3').hide();
		$('#content1').show();
	});
	$(".back4").click(function(){
		$(".back4").click(function(){
			$('#content4').fadeOut(function(){
				$(this).find('#mapview').html('');
				$('#footer').show();
				$('#content').fadeIn();
			});
		});
	});
}
//Function view
function loadLocation(supermandant,year,month,day){
	$(".setDatetime").show();
	datePicker(supermandant);
	if(year=="undefined" || month=="undefined" || day =="undefined"){
		var new_date = new Date();
		var new_day = new_date.getUTCDate();
		var new_month = new_date.getUTCMonth()+1;
		var new_year = new_date.getUTCFullYear();
		$.get("/data_by_location?supermandant="+supermandant+"&year="+new_year+"&month="+new_month+"&day="+new_day,function(data){	
			data = "["+data+"]";
			var new_data = JSON.parse(data);
			var arr = new Array();
			recursion(new_data,arr);
			countStatic(1); // reset count
			var locations ="";
			for(var i=0;i<arr.length;i++){
				if(parseInt(arr[i].response_time)==0) continue;
				if(parseInt(arr[i].response_time)<3){
					locations+='<tr><td style="width:200px;padding-left:'+(10*arr[i].depth)+'px;">'+arr[i].name+'</td><td style="width:150px;">'+arr[i].number_of_requests+'</td><td style="width:150px;">'+arr[i].response_time+'</td></tr>';
				}else{
					locations+='<tr><td style="width:200px;padding-left:'+(10*arr[i].depth)+'px;">'+arr[i].name+'</td><td style="width:150px;">'+arr[i].number_of_requests+'</td><td style="width:150px;color:red">'+arr[i].response_time+'</td></tr>';
				}
			}
			$("#content1 #main ").html('<table width="500px"><tr><th>Location</th><th>Number Of Request</th><th>Response Time</th></tr>'+locations+'</table>');
			$("#content1").show();
			backClick();
			locationSelect();
		});
	}else{
		$.get("/data_by_location?supermandant="+supermandant+"&year="+year+"&month="+month+"&day="+day,function(data){	
			/*
			data = "["+data+"]";
			var new_data = JSON.parse(data);
			var arr = new Array();
			recursion(new_data,arr);
			countStatic(1); // reset count
			var locations ="";
			for(var i=0;i<arr.length;i++){
				if(parseInt(arr[i].response_time)==0) continue;
				if(parseInt(arr[i].response_time)<3){
					locations+='<tr><td style="width:200px;padding-left:'+(10*arr[i].depth)+'px;">'+arr[i].name+'</td><td style="width:150px;">'+arr[i].number_of_requests+'</td><td style="width:150px;">'+arr[i].response_time+'</td></tr>';
				}else{
					locations+='<tr><td style="width:200px;padding-left:'+(10*arr[i].depth)+'px;">'+arr[i].name+'</td><td style="width:150px;">'+arr[i].number_of_requests+'</td><td style="width:150px;color:red">'+arr[i].response_time+'</td></tr>';
				}
			}
			*/
			var locations = getDataLocation(data);
			$("#content1 #main ").html('<table width="500px"><tr><th>Location</th><th>Number Of Request</th><th>Response Time</th></tr>'+locations+'</table>');
			$("#content1").show();
			backClick();
			locationSelect();
		});
	}
}

//Load Activity
function loadActivity(supermandant){
	$(".setDatetime").show();
	$.get("/data_by_activity?supermandant="+supermandant,function(data){	
		data = "["+data+"]";
		var new_data = JSON.parse(data);
		var arr = new Array();
		recursion(new_data,arr);
		countStatic(1); // reset count
		var activities ="";
		for(var i=0;i<arr.length;i++){
			if(parseInt(arr[i].response_time)<3){
				activities+='<tr><td style="width:200px;padding-left:'+(10*arr[i].depth)+'px;">'+arr[i].name+'</td><td style="width:150px;">'+arr[i].number_of_requests+'</td><td style="width:150px;">'+arr[i].response_time+'</td></tr>';
			}else{
				activities+='<tr><td style="width:200px;padding-left:'+(10*arr[i].depth)+'px;">'+arr[i].name+'</td><td style="width:150px;">'+arr[i].number_of_requests+'</td><td style="width:150px;color:red;">'+arr[i].response_time+'</td></tr>';
			}
		}
		$("#content2 #main ").html('<table width="500px"><tr><th>Activity</th><th>Number Of Request</th><th>Response Time</th></tr>'+activities+'</table>');
		$("#content2").show();
		backClick();
		locationSelect();
	});
}
function loadActLocation(supermandant,loc){
	$.get("/data_by_activities?supermandant="+supermandant+"&location="+loc,function(data){	
		data = "["+data+"]";
		var new_data = JSON.parse(data);
		var arr = new Array();
		recursion(new_data,arr);
		countStatic(1); // reset count
		var actLoc ="";
		for(var i=0;i<arr.length;i++){
			if(parseInt(arr[i].response_time)<3){
				activities+='<div class="ui-widget-content" style="width:500px;"><div  class="name" style="width:250px;padding-left:'+(10*arr[i].depth)+'px;">'+arr[i].name+'</div><div class="reponsetime" style="width:150px;float:right;">'+arr[i].response_time+'</div><div class="numberRequest"style="width:100px;float:right;">'+arr[i].number_of_requests+'</div></div>';
			}else{
				activities+='<div class="ui-widget-content" style="width:500px;"><div  class="name" style="width:250px;padding-left:'+(10*arr[i].depth)+'px;">'+arr[i].name+'</div><div class="reponsetime" style="width:150px;float:right;color:red;">'+arr[i].response_time+'</div><div class="numberRequest"style="width:100px;float:right;">'+arr[i].number_of_requests+'</div></div>';
			}
		}
		$("#content3 #main #selectable").html(activities);
		$("#content3").show();
		backClick();
		locationSelect();
	})
}

function mapviewClick(supermandant){
	$(".mapview").click(function(){
		$( "#view-info" ).dialog( "close" );
		$("#content").fadeOut('slow',function(){
			$('#footer').hide();
			$('#content4').fadeIn('slow', function() {
				$('body').css("width:980px");
				$('#mapview').html(function(){
					$(this).attr('src', '/mapview?supermandant='+supermandant);
				});
		  });
		});
		backClick();
	});
}
///////////////////////////////////////////////////////////////////////////////////////
 function locationSelect(){
	$( "#selectable" ).selectable(function(){
		loadActLocation();
	});
}
function recursion(data,arr){
	for(var i=0;i<data.length;i++){
		var e = new Array();
		e.name=data[i].name;
		e.number_of_requests = data[i].number_of_requests;
		e.response_time = data[i].response_time;
		e.depth = data[i].depth;
		arr[countStatic()] =e;
		recursion(data[i].children,arr);
	}
}
function countStatic(resetFlag) {
	if (resetFlag==undefined){
		if ( typeof countStatic.counter == 'undefined' ) {
			countStatic.counter = 0;
		}    
	   return(countStatic.counter++);
	} else {
		countStatic.counter = 0;
	}
}
 function cancel(){
	$('.cancel').click(function(){
		$('#view-info').dialog( "close" );
	});
	$('.cancel').click(function(){
		$('#dialog').dialog( "close" );
	});
 }
 function remove(supermandant){
	$(".remove").click(function(){
		var removeSp = "#view-"+supermandant;
		
		$("#view-info").dialog("close");
		$(removeSp).remove();
	});
 }
function datePicker(supermandant){
	$( "#datepicker" ).datepicker({
	  showOn: "button",
	  buttonImage: "images/calendar.gif",
	  buttonImageOnly: true,
	  onSelect: function()
		{ 
			var  year =  $(this).datepicker('getDate').getFullYear();
			var month =  $(this).datepicker('getDate').getMonth()+1;
			var day = $(this).datepicker('getDate').getDate();
			loadLocation(supermandant,year,month,day)
		}
	});
}

function getDataLocation(data){
	data = "["+data+"]";
	var new_data = JSON.parse(data);
	var arr = new Array();
	recursion(new_data,arr);
	countStatic(1); // reset count
	var locations ="";
	for(var i=0;i<arr.length;i++){
		if(parseInt(arr[i].response_time)==0) continue;
		if(parseInt(arr[i].response_time)<3){
			locations+='<tr><td style="width:200px;padding-left:'+(10*arr[i].depth)+'px;">'+arr[i].name+'</td><td style="width:150px;">'+arr[i].number_of_requests+'</td><td style="width:150px;">'+arr[i].response_time+'</td></tr>';
		}else{
			locations+='<tr><td style="width:200px;padding-left:'+(10*arr[i].depth)+'px;">'+arr[i].name+'</td><td style="width:150px;">'+arr[i].number_of_requests+'</td><td style="width:150px;color:red">'+arr[i].response_time+'</td></tr>';
		}
	}
	return locations;
}
//////////////////////////////////////////
/*
function loadActivity(supermandant){
	$.get("/data_by_activity?supermandant="+supermandant,function(data){	
		data = "["+data+"]";
		var new_data = JSON.parse(data);
		var arr = new Array();
		recursion(new_data,arr);
		countStatic(1); // reset count
		var activities ="";
		for(var i=0;i<arr.length;i++){
			if(parseInt(arr[i].response_time)<3){
				activities+='<div class="ui-widget-content" style="width:500px;"><div  class="name" style="width:250px;padding-left:'+(10*arr[i].depth)+'px;">'+arr[i].name+'</div><div class="reponsetime" style="width:150px;float:right;">'+arr[i].response_time+'</div><div class="numberRequest"style="width:100px;float:right;">'+arr[i].number_of_requests+'</div></div>';
			}else{
				activities+='<div class="ui-widget-content" style="width:500px;"><div  class="name" style="width:250px;padding-left:'+(10*arr[i].depth)+'px;">'+arr[i].name+'</div><div class="reponsetime" style="width:150px;float:right;color:red;">'+arr[i].response_time+'</div><div class="numberRequest"style="width:100px;float:right;">'+arr[i].number_of_requests+'</div></div>';
			}
		}
		$("#content2 #main ").html(activities);
		$("#content2").show();
		backClick();
		locationSelect();
	});
}
*/
