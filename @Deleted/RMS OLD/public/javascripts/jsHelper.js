function twoDigits(myNumber){
	return ("0" + myNumber).slice(-2)
}
function reqFormat(s){
	return Number((parseFloat(s)).toFixed(0));
}
function resFormat(s){
	return parseFloat(s).toFixed(2);
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

function getSetDateHtml(selectedDay, selectedMonth, selectedYear){
	var html="<table class='tbSetDate' >";
	html+=		"<tr><td>Day</td><td>: <select id='slDay'><option value=''>All Days</option>" ;
	for (var i=1; i<=31; i++){
		if (selectedDay==i)
			html+="<option value='"+i+"' selected>"+i+"</option>";
		else 
			html+="<option value='"+i+"'>"+i+"</option>";
	}
	html+=		"</select></td></tr>";
	
	html+=		"<tr><td>Month</td><td>: <select id='slMonth'><option value=''>All Months</option>" ;
	for (var i=1; i<=12; i++){
		if (selectedMonth==i)
			html+="<option value='"+i+"' selected>"+i+"</option>";
		else 
			html+="<option value='"+i+"'>"+i+"</option>";
	}
	html+=		"</select></td></tr>";
	
	html+=		"<tr><td>Year</td><td>: <select id='slYear'><option value=''>All Years</option>" ;
	for (var i=2008; i<=2015; i++){
		if (selectedYear == i)
			html+="<option value='"+i+"' selected>"+i+"</option>";
		else	
			html+="<option value='"+i+"'>"+i+"</option>";
	}
	html+=		"</select></td></tr>";
	html+=   "</table>";
	html+="<div><button id='btSelectDate'>Select</button></div>";
	return html;
}

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
  // http://kevin.vanzonneveld.net
  // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // +   improved by: vlado houba
  // +   input by: Billy
  // +   bugfixed by: Brett Zamir (http://brett-zamir.me)
  // *     example 1: in_array('van', ['Kevin', 'van', 'Zonneveld']);
  // *     returns 1: true
  // *     example 2: in_array('vlado', {0: 'Kevin', vlado: 'van', 1: 'Zonneveld'});
  // *     returns 2: false
  // *     example 3: in_array(1, ['1', '2', '3']);
  // *     returns 3: true
  // *     example 3: in_array(1, ['1', '2', '3'], false);
  // *     returns 3: true
  // *     example 4: in_array(1, ['1', '2', '3'], true);
  // *     returns 4: false
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