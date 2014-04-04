var chartScreen={
	// VARIABLES
	supermandant: "",
	intervalHandler: null,
	prevScreen: null,
	selectedDay:"",
	selectedMonth:"",
	selectedYear:"",
	selectedLocation: "",
	selectedActivity: "",
	
	// METHODS
	init: function(smName, prevScreen){		
		if (typeof prevScreen !== 'undefined'){
			this.prevScreen=prevScreen;			
		} else {
			$('#chartScreen .btBack').css('display','none');
		}
		this.supermandant=smName;
		$('#chartScreen .screenTitle').html("Chart View ("+smName+")");				
		
		// Preselect Date
		var currentDate=new Date();
		this.selectedDay=""; // Add Days
		this.selectedMonth=currentDate.getMonth()+1;
		this.selectedYear=currentDate.getFullYear();		
	},
	hide: function(){
		$('#chartScreen').css('display','none');
		this.disableEventHandlers();
	},
	show: function(){
		currentScreen=this;
		$('#chartScreen').css('display','block');
		this.activeEventHandlers();
		this.reloadScreenBody();
	},
	drawChart: function(){
		var url;
		if (this.selectedYear==""){
			// Chart: Years
			url="data_by_year?supermandant="+this.supermandant+"&location="+this.selectedLocation+"&activity="+this.selectedActivity;
			chartTitle="Chart for All Years";
			hAxis='Years';
		} else if (this.selectedMonth==""){
			// Chart: Months
			url="data_by_month?supermandant="+this.supermandant+"&year="+this.selectedYear+"&location="+this.selectedLocation+"&activity="+this.selectedActivity;
			chartTitle="Chart for All Months in "+this.selectedYear;
			hAxis='Months';
		} else if (this.selectedDay==""){
			// Chart: Days
			url="data_by_day?supermandant="+this.supermandant+"&year="+this.selectedYear+"&month="+this.selectedMonth+"&location="+this.selectedLocation+"&activity="+this.selectedActivity;
			chartTitle="Chart for All Days in "+this.selectedMonth+"/"+this.selectedYear;
			hAxis='Days';
		} else {			
			// Chart: Hours
			url="data_by_hour?supermandant="+this.supermandant+"&year="+this.selectedYear+"&month="+this.selectedMonth+"&day="+this.selectedDay+"&location="+this.selectedLocation+"&activity="+this.selectedActivity;
			chartTitle="Chart for All Hours on "+this.selectedDay+"/"+this.selectedMonth+"/"+this.selectedYear;
			hAxis='Hours';
		}
		
		$.get(url, function(data){
			var obj=JSON.parse(data);
			var arr=obj.children;						
			
			var chartDataArray=[
			  [hAxis, 'Number of Requests', 'Response Time']
			];
			for (var i=0; i<arr.length; i++){
				var e=arr[i];				
				var hAxisPoint=e.name;
				if (hAxisPoint.indexOf(".")>0) hAxisPoint=hAxisPoint.substr(0,2);
				chartDataArray.push( [ hAxisPoint,  Number((parseFloat(e.number_of_requests)).toFixed(0)) , Number((parseFloat(e.response_time)).toFixed(2)) ] );
			}			
			var chartData = google.visualization.arrayToDataTable(chartDataArray);

			var options = {
			  title: chartTitle,		  
			  series: {
					0: { targetAxisIndex: 0 },
					1: { targetAxisIndex: 1 },
			  },
			  vAxes: {
				0: { title: 'Number of Requests',textStyle:{color: 'blue'}},
				1: { title: 'Response Time',textStyle:{color: 'red'}}
			  },
			  hAxis: {title: hAxis,  titleTextStyle: {color: 'black'}}
			};

			var chart = new google.visualization.LineChart(document.getElementById('chart_div'));
			chart.draw(chartData, options);
		});
	}, 
	reloadScreenBody: function(){
		var thisScreen=this;		
		
		var url="data_for_map?supermandant="+thisScreen.supermandant+"&day="+thisScreen.selectedDay+"&month="+thisScreen.selectedMonth+"&year="+thisScreen.selectedYear;		
		console.log(url);
		$.get(url, function(data){
			var arr=JSON.parse(data);			
			var html="";
			
			// Change LAST-UPDATE time
			var currentDate=new Date();	
			var currentTime = currentDate.getDate() + "/"+ (currentDate.getMonth()+1)  + "/" + currentDate.getFullYear() + " @ "  + currentDate.getHours() + ":"  + currentDate.getMinutes() + ":" + currentDate.getSeconds();			
			html+="<div id='divLastUpdate' style='border-bottom:1px dotted black;'>Last Updated: <span id='spanLastUpdate'>"+currentTime+"</span></div>";
			
			// BODY CONTENT
			var windowHeight=$(window).height()-120;
			html+="<div id='chart_div' style='width:100%; height:"+windowHeight+"px;'></div>";
			
			$('#chartScreen .body').html(html);			
			
			// GOOGLE CHART
			google.setOnLoadCallback(thisScreen.drawChart());			
		  
			// Change "Set-date-button" text (show selected date)
			var tmpDay=thisScreen.selectedDay!=""?(thisScreen.selectedDay>=10?thisScreen.selectedDay:"0"+thisScreen.selectedDay):"--";
			var tmpMonth=thisScreen.selectedMonth!=""?(thisScreen.selectedMonth>=10?thisScreen.selectedMonth:"0"+thisScreen.selectedMonth):"--";
			var tmpYear=thisScreen.selectedYear!=""?thisScreen.selectedYear:"--";
			$('#chartScreen .btSetDate').html("Set Date ( "+tmpDay+"."+tmpMonth+"."+tmpYear+" )");
			
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
				$('#chartScreen .btSetInterval').html("Set Interval ("+nMins+")");
			} else {
				clearInterval(thisScreen.intervalHandler);				
				$('#chartScreen .btSetInterval').html("Set Interval");
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
		$(document).off('click','#btViewActs');
	}
}


