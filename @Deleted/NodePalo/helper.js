var http=require("http")
	, fs=require('fs');

// =========================================================================================
// ====================================== HELPER ============================================

exports.getOEntries=function(message){
	var arrEntries=message.split("::");	
	var arrOEntries=new Array();
	for (var i=0;i<arrEntries.length;i++){
		var oEntry=JSON.parse(arrEntries[i]);
		arrOEntries[arrOEntries.length]=oEntry;							
	}
	return arrOEntries;
}
				
/*  +++++++++++ parseElements ++++++++++
input: Palo HTTP API response
return: array of Elements (instances of Element class) 
++++++++++++++++++++++++++++++++++*/

exports.parseElements=function(chunk){	
	var tmpLines=chunk.split("\n");	
	var nLines=tmpLines.length-1; // 1 blank line			
	var arr=new Array();
	for (i=0;i<nLines;i++){
		if (getPaloResponseCell(chunk,i,2)=="element name is already in use"){
		} else {
			var e={}; //element
			e.id=getPaloResponseCell(chunk,i,0);
			e.name=getPaloResponseCell(chunk,i,1);
			e.level=getPaloResponseCell(chunk,i,3);
			e.indent=getPaloResponseCell(chunk,i,4);
			e.depth=getPaloResponseCell(chunk,i,5);
			e.parent=getPaloResponseCell(chunk,i,8);		
			arr[arr.length]=e;	
		}
	}	
	return arr;
}


/*  +++++++++++ parseCubes ++++++++++
input: Palo HTTP API response
return: array of Cubes (instances of Cube class) 
++++++++++++++++++++++++++++++++++*/

exports.parseCubes=function(chunk){
	 var tmpLines=chunk.split("\n");
	 var nLines=tmpLines.length-1;
	 var arr=new Array();
	 for (i=0;i<nLines;i++){      
	   var cube={}; //cube
	   cube.id=getPaloResponseCell(chunk,i,0);;
	   cube.name=getPaloResponseCell(chunk,i,1);
	   if (strpos(cube.name,"#")===false){  
		arr[arr.length]=cube;  
	   }
	 }
	 return arr;
}
/*  +++++++++++ parseDimensions ++++++++++
input: Palo HTTP API response
return: array of Dimensions (instances of Dimension class) 
++++++++++++++++++++++++++++++++++*/
exports.parseDimensions=function(chunk){
	var tmpLines=chunk.split("\n");	
	var nLines=tmpLines.length-1; // 1 blank line	
	var arrDims=new Array();	
	var  tmpDimName;
	for (i=0;i<nLines;i++){
		tmpDimName=getPaloResponseCell(chunk,i,1);
		if (strpos(tmpDimName,"#")===false){						
			var tmpDim={}; // dim
			tmpDim.name=tmpDimName;
			tmpDim.id=getPaloResponseCell(chunk,i,0);
			arrDims[arrDims.length]=tmpDim;
		}	
	}
	return arrDims;
}


/*  +++++++++++ strpos ++++++++++
Get string position of a substring
+++++++++++++++++++++++++++*/
function strpos(haystack, needle, offset) {  
	var i = (haystack + '').indexOf(needle, (offset || 0));	
	return i === -1 ? false : i;
}


/*  +++++++++++ getPaloResponseCell ++++++++++
Normally Palo HTTP API response is with this format:
	1;"abc";2;3;4;5;6;
	7;"def";8;9;10;11;12;
So this function will return exactly value at (line, position)  [both these parameters and 0-based int)	
+++++++++++++++++++++++++++++++++++++++*/
function getPaloResponseCell(content,line,position){
	var tmpArr=content.split("\n"); // may different between Linux and Windows ? \r\n ?
	var line=tmpArr[line];
	var tmpQuote="";	
	if (strpos(line,'"')){		
		var firstDoubleQuote=strpos(line,'"');
		var secondDoubleQuote=strpos(line,'"',firstDoubleQuote+1);
		tmpQuote=line.substring(firstDoubleQuote,secondDoubleQuote+1);
		line=line.replace(tmpQuote,"xxx");
	}	
	var tmpArr=line.split(";");
	var value=tmpArr[position];
	if (value=="xxx") value=tmpQuote;	
	value=value.replace(/"/g,''); // remove all double quote
	return value;
}


/* ++++++++++++++++++ getDateArray ++++++++++++++++++++
Get current Year, Month, Day, Hour (same format as Palo elements).
Return an array
+++++++++++++++++++++++++++++++++++++++++++++++++*/

 exports.getDateArray = function(timestamp){
	var arr = new Array();
	var date = new Date(timestamp);
	var year = date.getUTCFullYear();
	year = year.toString();
	arr.year = year;
	var month = date.getUTCMonth()+1;
	month = month.toString();
	if(month.length==1){
		month='0'+month+'.Month';
	}else{
		month=month+'.Month';
	}
	arr.month=month;
	var day = date.getUTCDate();
	day = day.toString();
	if(day.length==1){
		day='0'+day+'.Day';
	}else{
		day=day+'.Day';
	}
	arr.day = day;
	var hour = date.getUTCHours();
	hour = hour.toString();
	if(hour.length==1){
		hour='0'+hour+'.Hour';
	}else{
		hour=hour+'.Hour';
	}
	arr.hour=hour;
	return arr;
 }


// =========================================================================================
// ========================================= ROUTE ==========================================
// ~ GET /form
exports.form = function(req, res){
  res.render('form', { title: 'Express' });
};

// ~ GET /clear	
//Clear file log in 'console/log.txt'
exports.clear=function(req,res){	
	fileLog='./log.txt';
	fs.writeFile(fileLog, "", function(err) {
		if(err) {
			console.log(err);
		} else {
			console.log("The file was saved!");
			res.send('Clear');
		}
	}); 
};
//========================GET ROOT ELEMENTS==============================================
//========================================================================================
exports.getRootElementId = function(arrElements,elementName){
//return : root element ID
	var rootElementId;
	for (var i=0; i<arrElements.length;i++){
		if (arrElements[i].name==elementName){
			arrElementId=arrElements[i].id;			
			break;
		}
	}
	return arrElementId;
}

//=========================GET TIME =======================================================
//========================================================================================
exports.getTime = function(content){
	var date = new Date();
	var year = date.getFullYear();
	var month = date.getMonth()+1;
	var  day = date.getDay();
	var hour = date.getHours();
	var minute = date.getMinutes();
	var second = date.getSeconds();
	var millisecond = date.getMilliseconds();
	var content =  content+" : "+year+"-"+month+"-"+ day+"  "+hour+":"+minute+":"+second+"."+millisecond+"\r\n";
	return content;
}
//=========================GET DIMENSION ID BY NAME=========================================
//========================================================================================
exports.getDimIdByName = function(dimensions,dimName){
	for(var i=0;i<dimensions.length;i++){
		if(dimensions[i].name == dimName){
			return dimensions[i].id;
		}
	}
}
//=========================GENERATE CELLPATH=========================================
//========================================================================================
exports.generateCellPath = function(arrDimensions,R_ArrayCellPath,E_ArrayCellPath){
	console.log("____________"+arrDimensions[10].name);
	console.log("____________"+E_ArrayCellPath[arrDimensions[10].name]);
	//console.log("________________"+E_ArrayCellPath["Measurement"]);
	//return E_ArrayCellPath;
	var path ='';
	for(var i=0;i<arrDimensions.length;i++){
		console.log(i);
		console.log(arrDimensions[i].name);
		if(R_ArrayCellPath[arrDimensions[i].name]){
			console.log(arrDimensions[i].name);
			path += R_ArrayCellPath[arrDimensions[i].name];
			if(i<arrDimensions.length -1){
				path +=',';
			}
		}
		else if(E_ArrayCellPath[arrDimensions[i].name]){
			console.log("____________"+E_ArrayCellPath[arrDimensions[10].name]);
			console.log(arrDimensions[i].name);
			path += E_ArrayCellPath[arrDimensions[i].name];
			console.log(arrDimensions[i].name+" : "+E_ArrayCellPath[arrDimensions[i].name]);
			if(i<arrDimensions.length -1){
				path +=',';
			}
		}
		
	}
	return path;
}
//=========================GET DIMENSION PATH=========================================
//========================================================================================
exports.getDimensionsPath = function(dimensions){
	var dimension_path ;
	for(var i =0;i<dimensions.length;i++){
		if(i==0){
			dimension_path =dimensions[i].id;
		}else{
			dimension_path+=','+dimensions[i].id;
		}
	}
	return dimension_path;
}