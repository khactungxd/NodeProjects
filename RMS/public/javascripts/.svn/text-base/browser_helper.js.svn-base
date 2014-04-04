/* ====================================================================================================
=========										PALO RELATED							===============
======================================================================================================= */
function paloDecode(s){
	// Remove tail
	var atPosition=-1;
	while (true){
		atPosition=s.indexOf("@",atPosition+1);		
		if (atPosition==-1){			
			s=s.replace(/\\\\/g, '\\'); 
			s=s.replace(/\\@/g, '@');
			return s;
		}
		// count number of "\" before "@"
		var count=0;
		for (var j=atPosition-1; j>=0; j--){
			if (s[j]!="\\") break;
			count++;
		}
		if (count%2==0) break;
	}
	s=s.substr(0,atPosition);	
	s=s.replace(/\\\\/g, '\\'); 
	s=s.replace(/\\@/g, '@');
	return s;
}

// function: convertTreeToArray (Tree: the Json tree returned by RMS server side - query all data by a dimension)
function convertTreeToArray(tree){
	var arr=[];	
	var e=[]; // an element in tree (tree node)
	e['name']=tree.name;	
	if (tree.depth) e['depth']=tree.depth;
	if (tree.number_of_requests) e['nor']=tree.number_of_requests;
		else e['nor']=0; // nor = Number of Requests
	if (tree.response_time) e['rt']=tree.response_time;
		else e['rt']=0; // rt = Response Time
	arr.push(e);
	
	var arrChildren=[];
	if ( tree.children.length > 0 ){
		for (var i=0; i<tree.children.length; i++){
			arrChildren=arrChildren.concat( convertTreeToArray(tree.children[i]) );
		}
	}
	arr=arr.concat(arrChildren); 
	return arr;
}


/* ====================================================================================================
=========									CONVERT / FORMAT							===============
======================================================================================================= */
function twoDigits(myNumber){
	return ("0" + myNumber).slice(-2)
}
function reqFormat(s){
	return Number((parseFloat(s)).toFixed(0));
}
function resFormat(s){
	return parseFloat(s).toFixed(2);
}


/* ====================================================================================================
=========									HTML GENERATOR								===============
======================================================================================================= */
function getListJsToolbarHtml(){
	var html='<div id="listJsToolbar">';
	html+=		'<span id="listJsSearchBox"><input class="search" placeholder="'+LANGUAGE.SEARCH+'" /></span>';
	html+=		'<span id="listJsFilterArea">';
	html+=			'<button class="btListJsFilter">Res>=3</button>';
	html+=			'<button class="btListJsRemoveFilter" style="display:none">Remove Filter</button>';
	html+=		'</span>';
	html+=	'</div>'
	return html;
	//<span class="sort" data-sort="spanLocationIndex">Sort by spanLocationName</span>'; ==> FOR LIST JS SORTING
}
function getLastUpdatedHtml(){
	var currentDate=new Date();
	var currentTime = currentDate.getDate() + "/"+ (currentDate.getMonth()+1)  + "/" + currentDate.getFullYear() + " @ "  + currentDate.getHours() + ":"  + currentDate.getMinutes() + ":" + currentDate.getSeconds();	
	var html="<div id='divLastUpdate' style='border-bottom:1px dotted black;'>"+LANGUAGE.LAST_UPDATE+": <span id='spanLastUpdate'>"+currentTime+"</span></div>";
	return html;
}
function getSetDateHtml(selectedDay, selectedMonth, selectedYear){
	var html="<table class='tbSetDate' >";
	html+=		"<tr><td>"+LANGUAGE.DAY+"</td><td>: <select id='slDay'><option value=''>"+LANGUAGE.ALL+"</option>" ;
	for (var i=1; i<=31; i++){
		if (selectedDay==i)
			html+="<option value='"+i+"' selected>"+i+"</option>";
		else 
			html+="<option value='"+i+"'>"+i+"</option>";
	}
	html+=		"</select></td></tr>";
	
	html+=		"<tr><td>"+LANGUAGE.MONTH+"</td><td>: <select id='slMonth'><option value=''>"+LANGUAGE.ALL+"</option>" ;
	for (var i=1; i<=12; i++){
		if (selectedMonth==i)
			html+="<option value='"+i+"' selected>"+i+"</option>";
		else 
			html+="<option value='"+i+"'>"+i+"</option>";
	}
	html+=		"</select></td></tr>";
	
	html+=		"<tr><td>"+LANGUAGE.YEAR+"</td><td>: <select id='slYear'><option value=''>"+LANGUAGE.ALL+"</option>" ;
	for (var i=2008; i<=2015; i++){
		if (selectedYear == i)
			html+="<option value='"+i+"' selected>"+i+"</option>";
		else	
			html+="<option value='"+i+"'>"+i+"</option>";
	}
	html+=		"</select></td></tr>";
	html+=   "</table>";
	html+="<div><button id='btSelectDate'>"+LANGUAGE.SELECT+"</button></div>";
	return html;
}


/* ====================================================================================================
=========								JAVASCRIPT HELPER FUNCTIONS						===============
======================================================================================================= */
// FILTER ARRAY
if (!Array.prototype.filter)
{
  Array.prototype.filter = function(fun /*, thisp*/)
  {
    var len = this.length;
    if (typeof fun != "function")
      throw new TypeError();

    var res = new Array();
    var thisp = arguments[1];
    for (var i = 0; i < len; i++)
    {
      if (i in this)
      {
        var val = this[i]; // in case fun mutates this
        if (fun.call(thisp, val, i, this))
          res.push(val);
      }
    }

    return res;
  };
}

// EQUALS TO PHP in_array function
function in_array (needle, haystack, argStrict) {
  var key = '',
    strict = !! argStrict;

  if (strict) {
    for (key in haystack) {
      if (haystack[key] === needle) {
        return true;
      }
    }
  } else {
    for (key in haystack) {
      if (haystack[key] == needle) {
        return true;
      }
    }
  }

  return false;
}

// GET URL PARAMETERS
var QueryString = function () {
  // This function is anonymous, is executed immediately and 
  // the return value is assigned to QueryString!
  var query_string = {};
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i=0;i<vars.length;i++) {
    var pair = vars[i].split("=");
    	// If first entry with this name
    if (typeof query_string[pair[0]] === "undefined") {
      query_string[pair[0]] = pair[1];
    	// If second entry with this name
    } else if (typeof query_string[pair[0]] === "string") {
      var arr = [ query_string[pair[0]], pair[1] ];
      query_string[pair[0]] = arr;
    	// If third or later entry with this name
    } else {
      query_string[pair[0]].push(pair[1]);
    }
  } 
    return query_string;
} ();