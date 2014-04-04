chartScreen=new Screen();
	
chartScreen.init= function(smName, prevScreen, mandantName){		
	this.GUI=$('#chartScreen');
	
	if (typeof prevScreen !== 'undefined'){
		this.prevScreen=prevScreen;			
	} else {
		this.GUI.find('.btBack').css('display','none');
	}
	this.supermandant=smName;
	if (typeof mandantName !== 'undefined' && mandantName!=""){
		this.mandant=mandantName;
		this.GUI.find('.screenTitle').html("Chart View ("+mandantName+" - "+smName+")");
	} else {
		this.mandant="";
		this.GUI.find('.screenTitle').html("Chart View ("+smName+")");
	}

  this.selectedLocation="";
  this.selectedActivity="";
	this.initDate();	
}

chartScreen.drawChart=function(){
	var url;
	if (this.selectedYear==""){
		// Chart: Years
		url="data/by_year?supermandant="+this.supermandant+"&mandant="+this.mandant+"&location="+this.selectedLocation+"&activity="+this.selectedActivity;
		chartTitle=LANGUAGE.CHART_FOR_YEARS;
		hAxis=LANGUAGE.YEAR;
	} else if (this.selectedMonth==""){
		// Chart: Months
		url="data/by_month?supermandant="+this.supermandant+"&mandant="+this.mandant+"&year="+this.selectedYear+"&location="+this.selectedLocation+"&activity="+this.selectedActivity;
		chartTitle=LANGUAGE.CHART_FOR_MONTHS+" - "+this.selectedYear;
		hAxis=LANGUAGE.MONTH;
	} else if (this.selectedDay==""){
		// Chart: Days
		url="data/by_day?supermandant="+this.supermandant+"&mandant="+this.mandant+"&year="+this.selectedYear+"&month="+this.selectedMonth+"&location="+this.selectedLocation+"&activity="+this.selectedActivity;
		chartTitle=LANGUAGE.CHART_FOR_DAYS+" - "+twoDigits(this.selectedMonth)+"/"+this.selectedYear;
		hAxis=LANGUAGE.DAY;
	} else {			
		// Chart: Hours
		url="data/by_hour?supermandant="+this.supermandant+"&mandant="+this.mandant+"&year="+this.selectedYear+"&month="+this.selectedMonth+"&day="+this.selectedDay+"&location="+this.selectedLocation+"&activity="+this.selectedActivity;
		chartTitle=LANGUAGE.CHART_FOR_HOURS+" - "+twoDigits(this.selectedDay)+"/"+twoDigits(this.selectedMonth)+"/"+this.selectedYear;
		hAxis=LANGUAGE.HOUR;
	}
	
	$.get("webservice/"+url, function(data){
		var obj=JSON.parse(data);
		var arr=obj.children;						
		
		var chartDataArray=[
		  [hAxis, LANGUAGE.NUMBER_OF_REQUESTS, LANGUAGE.RESPONSE_TIME]
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
			0: { title: LANGUAGE.NUMBER_OF_REQUESTS ,textStyle:{color: 'blue'}},
			1: { title: LANGUAGE.RESPONSE_TIME ,textStyle:{color: 'red'}}
		  },
		  hAxis: {title: hAxis,  titleTextStyle: {color: 'black'}}
		};

		var chart = new google.visualization.LineChart(document.getElementById('chart_div'));
		chart.draw(chartData, options);
	});
}

chartScreen.reloadScreenBody=function(){
	var thisScreen=this;		
	
	var url="webservice/data/for_map?supermandant="+thisScreen.supermandant+"&day="+thisScreen.selectedDay+"&month="+thisScreen.selectedMonth+"&year="+thisScreen.selectedYear;
	$.get(url, function(data){
		var arr=JSON.parse(data);		
		
		var html=getLastUpdatedHtml();
	
	// BODY CONTENT
		var windowHeight=$(window).height()-125;
		html+="<div id='chart_div' style='width:100%; height:"+windowHeight+"px;'></div>";		
		thisScreen.GUI.find('.body').html(html);			
		
		// GOOGLE CHART
		google.setOnLoadCallback(thisScreen.drawChart());			
	  
		thisScreen.updateSetDateButton();
	});
}

chartScreen.activeEventHandlers=function(){
	var thisScreen=this;
	this.activeCommonEventHandlers();
}
chartScreen.disableEventHandlers=function(){
}
