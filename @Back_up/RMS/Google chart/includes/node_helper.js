var http=require("http");
var fs=require('fs');
var TEST=true;

// ==============================================================================
// =======================*** GENERATE JSON RESPONSE *** ========================== //
	
exports.generateJsonData=function(arrDimensions, targetDimension, arrCellValues){
	//console.log(arrCellValues);
	var data="";	
	for ( var i=0; i<arrDimensions.length;i++){
		if(arrDimensions[i].name == targetDimension) {
			var inputArray = arrDimensions[i].elements;			
			var outputArray=recursion_getElementsTree(0,"",inputArray,arrCellValues) ;			
			countStatic(1); // reset count
			data=outputArray[0];			
			break;
		}
	}		
	return data;
}

function recursion_getElementsTree(depth,parentId,inputArray, arrValues){		
	//console.log("recursionGetElements depth:"+depth+" parentId:"+parentId);
	var outputArray = new Array();
	
	for(var i=0 ; i<inputArray.length ;i++){
		if(inputArray[i].depth != depth) continue;
		if(inputArray[i].parent != parentId) continue;
		var e={}; // elements
		//insert e.depth
		e.name=inputArray[i].name;
		e.depth = inputArray[i].depth;
		e.number_of_requests = arrValues[countStatic()];
		e.response_time=arrValues[countStatic()];		
		e.children=recursion_getElementsTree(depth+1,inputArray[i].id,inputArray, arrValues);
		outputArray[outputArray.length]=e;		
	}
	return outputArray;
}
function countStatic(resetFlag) {
	if (resetFlag==undefined){
		// Check to see if the counter has been initialized
		if ( typeof countStatic.counter == 'undefined' ) {
			// It has not... perform the initilization
			countStatic.counter = 0;
		}    
	   return(countStatic.counter++);
	} else {
		countStatic.counter = 0;
	}
}

// =========================================================================================
// ================*** GET ELEMENTS ARRAY OF A DIMENSION (BY DFS)  ***========================== //	
// (DFS=depth-first search)

exports.getElementsArrayByDFS=function(arrDimensions, targetDimension){	
	for ( var i=0; i<arrDimensions.length;i++){
		if(arrDimensions[i].name == targetDimension) {
			var inputArray = arrDimensions[i].elements;
			//console.log(inputArray);			
			var outputArray= recursion_getElementsArrayByDFS(0,"",inputArray) ;
			outputArray.splice(0,1); // because first element is a virtual null element (in case there are 2 elements at depth 0)
			return outputArray;
		}
	}
}
function recursion_getElementsArrayByDFS(depth,parentId,inputArray){	
	var outputArray = new Array(parentId);
	for(var i=0 ; i<inputArray.length ;i++){
		if(inputArray[i].depth != depth) continue;
		if(inputArray[i].parent != parentId) continue;
		outputArray = outputArray.concat(recursion_getElementsArrayByDFS(depth+1,inputArray[i].id,inputArray));
	}
	return outputArray;
}
exports.getMeasurementElementList=function(arrDimensions){
	return new Array(0,1);
}


// ==================================================================================	
// =============================== *** ELEMENTS *** ==================================== //	

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
			//console.log("Error: Element name is in use ! - chunk="+chunk);
		} else {
			var e={};
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

// Get element Id By Name
exports.getElementId = function(arrElements,elementName){			
	for (var i=0; i<arrElements.length;i++){
		if (arrElements[i].name==elementName){			
			return arrElements[i].id;
		}
	}
}

/* ======== GetDictionaryRootElements =========
Input: an array of all dimensions and elements inside
output: a dictionary (js object) which translate each Dim name ==> Root element name 
(for ex: dictionary['Year']='AllYears'; ...)	
======================================*/	
exports.getDictionaryRootElements=function(arrDimensions){
	var d={};
	for (var i=0;i<arrDimensions.length; i++){		
		// Find root element name
		var rootElementName="";
		var arrElements=arrDimensions[i].elements;
		for (var j=0; j<arrElements.length; j++){
			if (arrElements[j].depth==0){
				rootElementName=arrElements[j].name;
				break;
			}
		}
		// Add root element name to array
		d[arrDimensions[i].name]=rootElementName;
	}
	return d;
}

// ==================================================================================	
// ================================= *** CELL *** ====================================== //	

/*  +++++++++++ parseCell(s) ++++++++++
input: Palo HTTP API response
++++++++++++++++++++++++++++++++++*/
exports.parseCells = function(chunk){
	//console.log("parseCells chunk="+chunk);
	var  tmpLines = chunk.split("\n");
	var nLines = tmpLines.length -1 ;
	var arr=new Array();
	for(var i=0;i<nLines;i++){
		var e = {}; //cell
		e.type = getPaloResponseCell(chunk,i,0);
		e.existed = getPaloResponseCell(chunk,i,1);
		if(e.existed ==1){
			e.value = getPaloResponseCell(chunk,i,2);
		}else{
			//e.value ="null";
			e.value =0;
		}
		arr[arr.length] = e.value;
	}
	return arr;
}
exports.parseCell = function(chunk){
	var  tmpLines = chunk.split("\n");
	var arr = tmpLines[0].split(";");
	var result;
	if(arr[1]==1){
		result = arr[2];
	}else{
		result = "null";
	}
	return result;
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
	// Encode "..." string
	if (strpos(line,'"')){		
		var firstDoubleQuote=strpos(line,'"');
		var secondDoubleQuote=strpos(line,'"',firstDoubleQuote+1);
		tmpQuote=line.substring(firstDoubleQuote,secondDoubleQuote+1);
		line=line.replace(tmpQuote,"xxx");
	}	
	var tmpArr=line.split(";");
	if (tmpArr[position]==undefined){
		console.log("!! ERROR !! Info: ");
		console.log("Line: "+line);
		console.log("Position: "+position);		
	}
	var value=tmpArr[position];
	if (value=="xxx") value=tmpQuote;	
	value=value.replace(/"/g,''); // remove all double quote
	return value;
}



// ==================================================================================	
// =============================== *** CUBE *** ==================================== //	

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
exports.getCubeIdByName=function(arrCubes, cubeName){
	//console.log("***  getCubeIdByName");
	//console.log("arrCubes="+arrCubes);
	//console.log("cubeName="+cubeName);
	for (var i=0; i<arrCubes.length; i++){
		if (arrCubes[i].name==cubeName){
			return arrCubes[i].id;
		}
	}
	return undefined;
}


// ==================================================================================	
// =============================== *** DIMENSION *** ==================================== //	

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
			var tmpDim={}; //dimension
			tmpDim.name=tmpDimName;
			tmpDim.id=getPaloResponseCell(chunk,i,0);
			arrDims[arrDims.length]=tmpDim;
		}	
	}
	return arrDims;
}
exports.getDimensionPosition=function(arrDimensions,dimensionName){
	// STUB
	if (dimensionName=="Locations"){
		return 5;
	} else if (dimensionName=="Activities") {
		return 6;
	} else if (dimensionName=="Measurement") {
		return 9;
	} else if (dimensionName=="Years") {
		return 0;
	} else if (dimensionName=="Months") {
		return 1;	
	} else if (dimensionName=="Days") {
		return 2;	
	} else if (dimensionName=="Hours") {
		return 3;	
	} else if (dimensionName=="UserHierarchy"){
		return 4;
	}
}
exports.getDimIdByName = function(dimensions,dimName){
	
	for(var i=0;i<dimensions.length;i++){
		if(dimensions[i].name == dimName){
			return dimensions[i].id;
		}
	}
}
// ==================================================================================	
// =============================== *** OTHERS *** ==================================== //	

/* +++++++++ paloEncode() ++++++++++
In palo, 1 dimension cannot has duplicated element name. So that means, in an Element Hierarchy, all elements must be different. 
So we have to encode the element name in this way: (using "@" character)
+ Element1
  - Element_foo@Element1
  - Element_bar@Element1
+ Element 2
  - Element_foo@Element2
  ...
But the problem is: the request from client may also include "@" character ==> we have to encode
"@" ==> "\@"
"\" ==> "\\"
For example:
Client string "ABC@gmail.com" ==> palo string "ABC\@gmail.com"

Input for this function is the whole array for element hierarchy  
+++++++++++++++++++++++++++++++++++*/
exports.paloEncode=function(arr){
	var arrResult=[];
	
	for(var i=0;i<arr.length;i++){
		var e=arr[i];		
		e=e.replace(/\\/g, '\\\\'); 
		e=e.replace(/@/g, '\\@'); 
		if (i>0) e=e+'@'+arrResult[arrResult.length - 1];
		//tmpAct=tmpAct.replace(' ','');
		arrResult.push(e);		
	}	
	return arrResult;
}
/* +++++++++ paloDecode() ++++++++++ (read paloEncode() )
This function is mainly for client javascript (so this function may not be used)
+++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/
exports.paloDecode=function(s){
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
	//s=s.replace(/ /g,'+');
	return s;
}


/*  +++++++++++ strpos ++++++++++
Get string position of a substring
+++++++++++++++++++++++++++*/

function strpos(haystack, needle, offset) {  
	var i = (haystack + '').indexOf(needle, (offset || 0));	
	return i === -1 ? false : i;
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


// ==================================================================================	
// =============================== *** PATH *** ==================================== //	

/*  +++++++++++ getPath ++++++++++
input: params,arrDimensions,targetDimensionName
return: fullPath to get cellValues
++++++++++++++++++++++++++++++++++*/
exports.getFullPath = function(params,arrDimensions,targetDimensionName){
	thishelper = this ;
	
	var arrTargetElementList=thishelper.getElementsArrayByDFS(arrDimensions,targetDimensionName);  // return array(0,1,2,4,3);	
	//console.log(targetDimensionName+" --- arrTargetElementList="+arrTargetElementList);
	var arrMeasurementElementList=thishelper.getMeasurementElementList(arrDimensions); // return array(0,1)
	var nDimensions=arrDimensions.length;
	var targetDimensionPosition	= thishelper.getDimensionPosition(arrDimensions,targetDimensionName);	
	var measurementDimensionPosition = thishelper.getDimensionPosition(arrDimensions,"Measurement");
	
	var fullPath="";
	for (var i=0; i<arrTargetElementList.length; i++){
		for (var j=0;j<arrMeasurementElementList.length;j++){
			var path="";
			for (var k=0; k<nDimensions; k++){
				if (k!=targetDimensionPosition && k!= measurementDimensionPosition){					
					params[ arrDimensions[k].name] = params[ arrDimensions[k].name].replace("+"," ");					
					path+=thishelper.getElementId(arrDimensions[k].elements, params[ arrDimensions[k].name] ) ;														
				} else if (k==targetDimensionPosition){					
					path+=arrTargetElementList[i];
				} else if (k==measurementDimensionPosition){
					path+=arrMeasurementElementList[j];
				}
				if (k<(nDimensions-1)) path+=",";
			}
			fullPath+=path;
			if (i != (arrTargetElementList.length-1) || j!=(arrMeasurementElementList.length-1)){
				fullPath+=":";
			}
		}
	}
	return fullPath;
}

/*  +++++++++++ getDimensionsPath ++++++++++
input: dimension array
return: string of all dimension ID, separated by comma (ex: 2,3,5,6,7...)
purpose: to createCube (need to state what dimensions for that new cube)
++++++++++++++++++++++++++++++++++*/
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

/*  +++++++++++ generateCellPath ++++++++++
where: (used in main.js to process requests from redis, push to Palo)
purpose: In a front-end request, there are 2 parts: 
 + request part
 + entry part (because 1 request may have many entries)
 ==> This function is to combine cellpath of these 2 parts
input: arr dimenstions, request cell path part (in array format, each element is a path to a dimension), entry cell path part
return: ONE cell path to a cell
++++++++++++++++++++++++++++++++++*/
exports.generateCellPath = function(arrDimensions,R_ArrayCellPath,E_ArrayCellPath){
	//console.log("____________"+arrDimensions[10].name);
	//console.log("____________"+E_ArrayCellPath[arrDimensions[10].name]);
	//console.log("________________"+E_ArrayCellPath["Measurement"]);
	//return E_ArrayCellPath;
	var path ='';
	for(var i=0;i<arrDimensions.length;i++){
		//console.log(i);
		//console.log(arrDimensions[i].name);
		if(!isNaN(R_ArrayCellPath[arrDimensions[i].name])){
			//console.log(arrDimensions[i].name);
			path += R_ArrayCellPath[arrDimensions[i].name];
			if(i<arrDimensions.length -1){
				path +=',';
			}
		}
		else if(!isNaN(E_ArrayCellPath[arrDimensions[i].name])){
			//console.log("____________"+E_ArrayCellPath[arrDimensions[10].name]);
			//console.log(arrDimensions[i].name);
			path += E_ArrayCellPath[arrDimensions[i].name];
			//console.log(arrDimensions[i].name+" : "+E_ArrayCellPath[arrDimensions[i].name]);
			if(i<arrDimensions.length -1){
				path +=',';
			}
		}
		
	}
	return path;
}
//================================================================================
