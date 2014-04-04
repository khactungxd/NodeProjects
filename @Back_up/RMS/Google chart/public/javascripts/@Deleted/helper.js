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
function getTime(){
	var date = new Date();
	var hour = date.getHours();
	var minute = date.getMinutes();
	var day = date.getUTCDate();
	var month = date.getUTCMonth()+1;
	var year = date.getUTCFullYear();
	var arr = new Array();
	arr.hour = hour;
	arr.minute = minute;
	arr.day = day;
	arr.month = month;
	arr.year = year;
	return arr;
}
