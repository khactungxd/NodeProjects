var http = require ('http')
	,fs = require('fs')
	,ks = require('fs')
	,palo = require ('../palo')
	,config=require('../config.js')
	,helper = require('../helper');
// *** MAIN FUNCTION TO PROCESS HTTP POST REQUEST ***	

var file = 'cache/geonames/coordinates.json';

exports.main=function(req,res){
	palo.login(function(paloSID){																					 // login to Palo
		palo.getFullDimensions(paloSID,config.DATABASE_ID,function(arrDimensions){ 	 // all dimensions with elements inside			
			var params=getParamters(req, arrDimensions);								 			 // all input parameters + combine with default values
			var fullCellPath=helper.getFullPath(params, arrDimensions,"Locations");									 	 // get palo cell path to use in Palo HTTP API							
			console.log("Full Path = "+fullCellPath);
			palo.getCubes(paloSID,config.DATABASE_ID,function(cubes){				
				var cubeID=helper.getCubeIdByName(cubes, params['supermandant']);
				//console.log("Cube ID = "+cubeID);
				if (cubeID!=undefined){
					palo.getCellValues(paloSID,config.DATABASE_ID,cubeID,fullCellPath,function(arrCellValues){
						console.log("Arr Cell Values = "+arrCellValues);
						printJSON(res, params, arrDimensions, arrCellValues);						// respond to client
					})
				} else {
					printError(res,"Cube doesn't exist");														// respond to client
				}
			})
		})
	})
}
	
function getParamters(req, arrDimensions){
	var params={};	
	params=helper.getDictionaryRootElements(arrDimensions);	
	params['apiName'] = "data_by_map";
	params['supermandant'] = req.query["supermandant"];		
	if (req.query['year']) params['Years']= req.query["year"];
	if (req.query['month']){
		var month=parseInt(req.query["month"]);
		if (month<10) params['Months']="0"+month+".Month";
		else params['Months']=month+".Month";		
	}
	if (req.query['day']){
		var day=parseInt(req.query["day"]);
		if (day<10) params['Days']="0"+day+".Day";
		else params['Days']=day+".Day";		
	}
	return params;
}

function printJSON(res,params,arrDimensions, arrCellValues){
	var data = generateJsonDataForMap(arrDimensions, "Locations", arrCellValues);	
	findCoordinateCountry(data,function(data){
		findCoordinatePostalCode(data,function(data){
			res.send(JSON.stringify(data));
		})
	});
}

function generateJsonDataForMap(arrDimensions, targetDimension, arrCellValues){
	var data="";	
	for ( var i=0; i<arrDimensions.length;i++){
		if(arrDimensions[i].name == targetDimension) {
			var inputArray = arrDimensions[i].elements;		
			var outputArray1 = new Array();
			var outputArray=recursion(0,"",inputArray,arrCellValues,0,outputArray1) ;			
			countStatic(1); // reset count
			data=outputArray;			
			break;
		}
	}		
	return data;
}

function recursion(depth,parentId,inputArray, arrValues,parentId2,outputArray){		
	for(var i=0 ; i<inputArray.length ;i++){
		if(inputArray[i].depth != depth) continue;
		if(inputArray[i].parent != parentId) continue;
		var e={};
		e.name=inputArray[i].name;
		e.depth = inputArray[i].depth;
		if(depth==2){
			var k ={};
			k.name= inputArray[i].name;
			k.depth = inputArray[i].depth;
			k.number_of_requests = arrValues[countStatic()];
			k.response_time = arrValues[countStatic()];	
			k.parentId = 0;
			parentId2 = inputArray[i].id;
			outputArray[outputArray.length] = k;
			console.log("123 " + inputArray[i].id);
		}else if(depth==5){
			var k = {};
			k.name= inputArray[i].name;
			k.depth = inputArray[i].depth;
			k.number_of_requests = arrValues[countStatic()];
			k.response_time = arrValues[countStatic()];	
			k.parentId = parentId2;
			outputArray[outputArray.length] = k;
			console.log("123 " + inputArray[i].id);
		}else{
			countStatic();
			countStatic();
		}
		e.children=recursion(depth+1,inputArray[i].id,inputArray, arrValues,parentId2,outputArray);
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

function findCoordinateCountry(arr,callback){
	fs.readFile(file,'utf8',function(err,chunk){
		chunk = JSON.parse(chunk);
		if(err){
			console.log("Error on reading file "+err);
		}
		for(var i=0;i<arr.length;i++){
			if(arr[i].depth !=2) continue;
			for(var j=0;j<chunk.length;j++){
				if(arr[i].name==chunk[j].countryName){
					arr[i].lat = chunk[j].lat;
					arr[i].lng = chunk[j].lng;
					break;
				}
			}
		}
		callback(arr);
	})
}
function findCoordinatePostalCode(arr,callback){
	getPostalCode(0,arr,function(arr){
		callback(arr);
	});
}
function getPostalCode(numb,arr,callback){
	if(arr[numb].depth == 5){
		var geonamesFile="./cache/geonames/"+arr[numb].name+".json";
		if (fs.existsSync(geonamesFile)){
			fs.readFile(geonamesFile, 'utf8', function (err,data) {
				if(err){
					console.log(' !!!!!!!!!!!! Error on reading file: countries.json !!!!!!!!!!! '+err);
					return;
				}
				var json=JSON.parse(data);
				arr[numb].lat = json.postalcodes[0].lat;
				arr[numb].lng = json.postalcodes[0].lng;
				if(numb<(arr.length-1)){
					getPostalCode(numb+1,arr,callback);
				}else{
					callback(arr);
				}
			})
		}else{
			var n = arr[numb].name.split(",");
			var postalCode = n[1];
			var countryCode = n[0];
			http.get("http://api.geonames.org/postalCodeLookupJSON?formatted=true&postalcode="+postalCode+"&country="+countryCode+"&username=thatko&&style=full", function(resp){
				resp.setEncoding('utf8');	
				resp.on('data',function(chunk){	
					console.log(chunk);
					var json=JSON.parse(chunk);
					arr[numb].lat =  json.postalcodes[0].lat;
					arr[numb].lng =  json.postalcodes[0].lng;
					fs.writeFile("./cache/geonames/"+countryCode+","+postalCode+".json", chunk, function(err) {
						if(err) {
							console.log(err);
						} else {
							console.log("The file was saved!");
						}
						if(numb<(arr.length-1)){
							getPostalCode(numb+1,arr,callback);
						}else{
							callback(arr);
						}
					}); 		
				});
			});
		}
	}else{
		if(numb<(arr.length-1)){
				getPostalCode(numb+1,arr,callback);
		}else{
			callback(arr);
		}
	}
}
