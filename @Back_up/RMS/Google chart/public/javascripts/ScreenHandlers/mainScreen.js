mainScreen=new Screen();
mainScreen.init=function(){
  var thisScreen=this;
  thisScreen.GUI=$('#mainScreen');

  // LOAD ADDED SUPER MANDANTS FROM LOCAL STORAGE

  if ( localStorage.getItem('arrAddedSuperMandants') )
    thisScreen.arrAddedSuperMandants=JSON.parse( localStorage.getItem('arrAddedSuperMandants') );




  // GET SUPERMANDANT LIST FROM SERVER
  $.get("webservice/supermandant/list", function(data){
    function superMandantExistInServer(element, index, array){
      if (in_array( element, thisScreen.arrServerSuperMandants )) return true; else return false;
    }
    thisScreen.arrServerSuperMandants = data;
    if (thisScreen.arrAddedSuperMandants!=undefined){
      // Remove SM in arrAddedSM that doesn't exist in server side
      thisScreen.arrAddedSuperMandants=thisScreen.arrAddedSuperMandants.filter(superMandantExistInServer);
      localStorage.setItem("arrAddedSuperMandants",JSON.stringify(thisScreen.arrAddedSuperMandants));
    } else {
      thisScreen.arrAddedSuperMandants=[];
    }
    thisScreen.generateSmDialog();
  })
}

mainScreen.activeEventHandlers=function(){
  var thisScreen=this;
  thisScreen.activeCommonEventHandlers();

  $(document).on('click','#btManageMandants',function(){
    $("#dlgMandants").dialog({title:LANGUAGE.MANDANTS});
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
    thisScreen.generateSmDialog(); 	// prepare content for next-time open SM Dialog

    // RELOAD MAIN SCREEN BODY
    thisScreen.reloadScreenBody();
  });

  $(document).on('click','#btSmDetails', function(){
    if (thisScreen.selectedMandant){
      $('#btRemoveSm').css('display','none');
      $("#dlgSmDetails").dialog( {width:270, title: thisScreen.selectedMandant} );
    } else {
      $('#btRemoveSm').css('display','inline');
      $("#dlgSmDetails").dialog( {width:270, title: thisScreen.selectedSupermandant} );
    }
  });
  $(document).on('click','.divSmOnly', function(){
    $('.divSmOnly').removeClass('selected');
    $('.divMandant').removeClass('selected');
    $(this).addClass('selected');
    thisScreen.selectedSupermandant=$(this).attr('smName');
    thisScreen.selectedMandant=$(this).attr('');
    $('#btSmDetails').removeAttr('disabled');
  });
  $(document).on('click','.divMandant', function(){
    $('.divSmOnly').removeClass('selected');
    $('.divMandant').removeClass('selected');
    $(this).addClass('selected');
    thisScreen.selectedSupermandant=$(this).attr('smName');
    thisScreen.selectedMandant=$(this).attr('mandantName');
    $('#btSmDetails').removeAttr('disabled');
  });

  $(document).on('click','#btRemoveSm', function(){
    var smName=thisScreen.selectedSupermandant;
    var index=thisScreen.arrAddedSuperMandants.indexOf(smName);
    thisScreen.arrAddedSuperMandants.splice(index,1);
    localStorage.setItem("arrAddedSuperMandants",JSON.stringify(thisScreen.arrAddedSuperMandants));
    thisScreen.generateSmDialog();
    $("#dlgSmDetails").dialog( "close" );
    thisScreen.reloadScreenBody();
  });
  $(document).on('click','#btLocationView', function(){
    $("#dlgSmDetails").dialog( "close" );
    thisScreen.hide();
    locationScreen.init(thisScreen.selectedSupermandant, thisScreen, thisScreen.selectedMandant);
    locationScreen.show();
  });
  $(document).on('click','#btActivityView', function(){
    $("#dlgSmDetails").dialog( "close" );
    thisScreen.hide();
    activityScreen.init(thisScreen.selectedSupermandant, thisScreen, "Globe", thisScreen.selectedMandant);
    activityScreen.show();
  });
  $(document).on('click','#btOrgunitView', function(){
    $("#dlgSmDetails").dialog( "close" );
    thisScreen.hide();
    orgunitScreen.init(thisScreen.selectedSupermandant, thisScreen, thisScreen.selectedMandant);
    orgunitScreen.show();
  });
  $(document).on('click','#btMapView', function(){
    $("#dlgSmDetails").dialog( "close" );
    thisScreen.hide();
    mapScreen.init(thisScreen.selectedSupermandant, thisScreen, thisScreen.selectedMandant);
    mapScreen.show();
  });
  $(document).on('click','#btChartView', function(){
    $("#dlgSmDetails").dialog( "close" );
    thisScreen.hide();
    chartScreen.init(thisScreen.selectedSupermandant, thisScreen, thisScreen.selectedMandant);
    chartScreen.show();
  });
}

mainScreen.disableEventHandlers=function(){
  $(document).off('click','#btManageMandants');
  $(document).off('click','#btSmDetails');
  $(document).off('click','.divSmOnly');
  $(document).off('click','.divMandant');
  $(document).off('click','#btRemoveSm');
  $(document).off('click','#btLocationView');
  $(document).off('click','#btActivityView');
  $(document).off('click','#btOrgunitView');
  $(document).off('click','#btMapView');
  $(document).off('click','#btChartView');
}

mainScreen.reloadScreenBody=function(){
  var thisScreen=this;
  $('#btSmDetails').attr('disabled','disabled');

  var html="";

  if (thisScreen.arrAddedSuperMandants==undefined || thisScreen.arrAddedSuperMandants.length==0){
    // Notice if there is no mandant added
    html+="<div style='text-align:center; font-size:1.5em'>"+LANGUAGE.NO_MANDANTS_ADDED+"</div>";;
  } else {
    html+="<div id='divLastUpdate'>"+LANGUAGE.LAST_UPDATE+": <span id='spanLastUpdate'></span></div>";
    html+="<div id='mainScreenListJS'>";
    html+='<div class="list">';
    for (var i=0; i<thisScreen.arrAddedSuperMandants.length; i++){
      var smName=this.arrAddedSuperMandants[i];
      html+="<div class='divSM' smName='"+smName+"'>";
      html+=" <div class='divSmOnly' smName='"+smName+"'>";
      html+="  <div class='divSmTitle'>"+smName+"</div><div style='clear:both'></div>";
      html+="  <div class='divSmData'>";
      html+="			<div class='smData'><span class='spanTodayTitle' smName='"+smName+"'>"+LANGUAGE.TODAY+"</span><span class='spanTodayRequests' smName='"+smName+"'>...</span><span class='spanTodayResponse' smName='"+smName+"'>...</span></div>";
      html+="			<div class='smData'><span class='spanThisMonthTitle' smName='"+smName+"'>"+LANGUAGE.THIS_MONTH+"</span><span class='spanThisMonthRequests' smName='"+smName+"'>...</span><span class='spanThisMonthResponse' smName='"+smName+"'>...</span></div>";
      html+="			<div class='smData'><span class='spanThisYearTitle' smName='"+smName+"'>"+LANGUAGE.THIS_YEAR+"</span><span class='spanThisYearRequests' smName='"+smName+"'>...</span><span class='spanThisYearResponse' smName='"+smName+"'>...</span></div>";
      html+="  </div>";
      html+="  <div style='clear:both'></div>";
      html+=" </div>";
      html+="	<div class='divMandantsInSM' smName='"+smName+"'></div>";
      html+="</div>";
    }
    html+='</div>'; // .list
    html+='</div>'; // #mainScreenListJS
  }

  thisScreen.GUI.find('.body').html(html);

  if (thisScreen.arrAddedSuperMandants != undefined  && thisScreen.arrAddedSuperMandants.length>0){
    var options = {
      valueNames: [ 'spanTodayRequests', 'spanTodayResponse', 'spanThisMonthRequests', 'spanThisMonthResponse', 'spanThisYearRequests', 'spanThisYearResponse' ]
    };
    thisScreen.listJS = new List('mainScreenListJS', options);

    // Send AJAX requests (recent_data)
    for (var i=0; i<thisScreen.arrAddedSuperMandants.length; i++){
      var smName=thisScreen.arrAddedSuperMandants[i];
      thisScreen.getSmData(smName);
    }
  }


}
mainScreen.getSmData=function(smName){
  var thisScreen=this;
  $.get("webservice/data/recent?supermandant="+smName, function(data){
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

    // Get mandant list and recent data for mandants
    $.get("webservice/mandant/list?supermandant="+smName, function(dataMandants){
      var arrMandants=JSON.parse(dataMandants);
      console.log(arrMandants);
      for (var i=0; i<arrMandants.length; i++){
        var mandantName=arrMandants[i];
        console.log(smName+" -1- "+mandantName);
        thisScreen.getMandantData(smName, mandantName);
        console.log(smName+" -2- "+mandantName);
      }
    });
  });
}

mainScreen.getMandantData= function(smName, mandantName){
  $.get("webservice/data/recent?supermandant="+smName+"&mandant="+mandantName, function(mandantRecentData){
    mandantRecentData=JSON.parse(mandantRecentData);
    if (mandantRecentData.this_year.number_of_requests>0){
      if ( $('.divMandant[smName='+smName+'][mandantName='+mandantName+']').length == 0 ){
        var html="";
        html+="<div class='divMandant' smName='"+smName+"' mandantName='"+mandantName+"' >";
        html+="  <div class='divMandantTitle'>"+mandantName+"</div><div style='clear:both'></div>";
        html+="  <div class='divMandantData'>";
        html+="			<div class='mandantData'><span class='spanTodayTitleMandant "+(mandantRecentData.today.response_time>=3?'red':'')+"' mandantName='"+mandantName+"'>"+LANGUAGE.TODAY+"</span><span class='spanTodayRequests' mandantName='"+mandantName+"'>"+reqFormat(mandantRecentData.today.number_of_requests)+"</span><span class='spanTodayResponse "+(mandantRecentData.today.response_time>=3?'red':'')+"' mandantName='"+mandantName+"'>"+resFormat(mandantRecentData.today.response_time)+"</span></div>";
        html+="			<div class='mandantData'><span class='spanThisMonthTitleMandant "+(mandantRecentData.this_month.response_time>=3?'red':'')+"' mandantName='"+mandantName+"'>"+LANGUAGE.THIS_MONTH+"</span><span class='spanThisMonthRequests' mandantName='"+mandantName+"'>"+reqFormat(mandantRecentData.this_month.number_of_requests)+"</span><span class='spanThisMonthResponse "+(mandantRecentData.this_month.response_time>=3?'red':'')+"' mandantName='"+mandantName+"'>"+resFormat(mandantRecentData.this_month.response_time)+"</span></div>";
        html+="			<div class='mandantData'><span class='spanThisYearTitleMandant "+(mandantRecentData.this_year.response_time>=3?'red':'')+"' mandantName='"+mandantName+"'>"+LANGUAGE.THIS_YEAR+"</span><span class='spanThisYearRequests' mandantName='"+mandantName+"'>"+reqFormat(mandantRecentData.this_year.number_of_requests)+"</span><span class='spanThisYearResponse "+(mandantRecentData.this_year.response_time>=3?'red':'')+"' mandantName='"+mandantName+"'>"+resFormat(mandantRecentData.this_year.response_time)+"</span></div>";
        html+="  </div>";
        html+="  <div style='clear:both'></div>";
        html+="</div>";
        $('.divMandantsInSM[smName='+smName+']').append(html);
      }
    }
  });
}

mainScreen.generateSmDialog=function(){
  var html="";
  for (var i=0;i<this.arrServerSuperMandants.length; i++){
    var added=false;
    for (var j=0;j<this.arrAddedSuperMandants.length; j++){
      if (this.arrAddedSuperMandants[j]==this.arrServerSuperMandants[i]) added=true;
    }
    if (added){
      html+="<div style='height:40px;'><button action='remove' class='btMandant button' superMandantName='"+this.arrServerSuperMandants[i]+"'>"+this.arrServerSuperMandants[i]+" ["+LANGUAGE.REMOVE+"]</button></div>";
    } else {
      html+="<div style='height:40px;'><button action='add' class='btMandant button' superMandantName='"+this.arrServerSuperMandants[i]+"'>"+this.arrServerSuperMandants[i]+" ["+LANGUAGE.ADD+"]</button></div>";
    }
  }
  $('#dlgMandants').html(html);
}