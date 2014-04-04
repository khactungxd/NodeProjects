// =========================== DEPENDENCIES ==============================
var redis = require('redis');							// NODE MODULE TO MANAGE REDIS DATABASE
var uaModule= require('express-useragent');				// USER-AGENT DETECTION

var helper = require('./includes/node_helper.js'); 		// PALO & JAVASCRIPT HELPER
var geonames = require('./includes/geonames');			// GEONAMES API
var palo=require('./includes/palo');					// MANAGE CONNECTION AND PARSING VALUE BETWEEN NODE AND PALO
var logger = require('./includes/logger');				

// =========================== CONFIG ==============================
var CONFIG=require('./config.js');
var TIME_RESTART = 5000;								// ONCE STARTED, THIS SCRIPT WILL RUN FOREVER, WITH INTERVAL = TIME_RESTART
var TEST=true;


// *** In case: Run this script as standalone script
start();

// *** In case: Using this script as an embedded module	
exports.start=function(){ start(); }

function start(){
	redisClient = redis.createClient();
	main();
}

/* ====================================== MAIN ======================================
Purpose: Read Frontend requests From Redis database and update data to Palo DB via Palo HTTP API
NOTE: G is the main array which stores all global necessary data (G=Global) (R=Request) (E=Entry) ( G > R > E )
===================================================================================*/
function main(){	 	
	var G = new Array();
	redisClient.keys("PaloRequest*",function(err,data){		// Read all requests from Redis Database
		G['arrKeys']=data;
		if(data.length >=1){
			process(0,G);									// Asynchronous processing each requests
		}else {
			console.log("Null");							// There is no request in Redis Database
			setTimeout(main,TIME_RESTART);					// Restart this script after TIME_RESTART milliseconds
		}		
	});		
}

function process(i, G){										// Process a LIST of requests (stored in 'G' array)
	//start new request
	var key=G['arrKeys'][i];
	var R=new Array();	
	R['log'] = logger.createRequestLog();
	R['arrCellPath'] = new Array();
	R['rootElement'] = new Array();
	R['dimId'] = new Array();
	R['currentRequestIndex']=i;
	R['isValid']=1;
	redisClient.HMGET(key, "message", "meta", function(err,data){
		R['meta'] = JSON.parse(data[1]);
		R['UserAgent']=R['meta'].userAgent;	
		R['Time'] = new Array();
		R['Time'] = helper.getDateArray(R['meta'].time);
		R['message']=JSON.parse(data[0]);	
		R['supermandant']= R['message'].supermandant;
		R['mandant'] = R['message'].mandant;
		R['orgunit'] = R['message'].orgunit;
		R['username'] = R['message'].username;
		R['location'] = R['message'].location;
		R['arrOEntries']=R['message'].entries;		
		if (R['arrOEntries'].length>0){
			palo.login(function(sid){
				R['paloSID']=sid;
				//~~GET CUBE LIST
				palo.getDimensions(R['paloSID'],CONFIG.DATABASE_ID,function(dimensions){
					R['arrDims']=dimensions;										
					palo.getCubes(R['paloSID'],CONFIG.DATABASE_ID,function(cubes){
						var existed = false ;
						for(var i =0;i<cubes.length ;i++){
							if(cubes[i].name ==  R['supermandant']){
								R['cubeId'] = cubes[i].id;
								existed = true ;
								break;
							}
						} 
						if(!existed){						// Create new Cube in Palo DB if not existed
							var DIMENSION_PATH ;
							palo.createCube(R['paloSID'],CONFIG.DATABASE_ID,R['supermandant'],helper.getDimensionsPath(dimensions),function(cubeId){
								R['cubeId'] = cubeId;
								R['arrCellPath'] = new Array();
								processARequest(G,R);
							})
						}else{
							processARequest(G,R);
						}
					})
				})
			});
		}else{
			processARequest_continue(G,R);
		}		
	})
}

function processARequest(G,R){			   					// Process a request (from redis)
	
	// *** CALCULATE / REFORMAT FRONT-END REQUEST PARAMETERS ***	
	var year = new Array();                
	year[year.length] = R['Time'].year;
	var month = new Array();               
	month[month.length] = R['Time'].month;
	var day = new Array();					
	day[day.length] = R['Time'].day;
	var hour = new Array();					
	hour[hour.length] = R['Time'].hour;
	var arrUser = [R.mandant];							
	for(var i =0;i<R['orgunit'].length;i++){
		arrUser.push( R['orgunit'][i] );
	}
	arrUser.push(R.username);
	
	//Browsers and OS
	var frontendAgent="x";
	if (R['UserAgent']!="" && R['UserAgent']!=undefined) frontendAgent=R['UserAgent'];					
	var uaObject=uaModule.parse(frontendAgent);	
	var arrBrowsers=new Array();
	var OS = new Array();
	OS[OS.length] = uaObject.OS;
	if(uaObject.Browser !="unknown"){
		arrBrowsers[0]=uaObject.Browser;
		arrBrowsers[1]=uaObject.Browser+" "+uaObject.Version;
	}else{
		arrBrowsers[arrBrowsers.length] ="Others" ;
	}
	
	// *** UPDATE PALO DIMENSIONS (Create new elements if necessary)
	geonames.parseLocation(R['location']['countryCode'],R['location']['postalCode'],function(locations){		
		updateDimension(R['paloSID'],helper.getDimIdByName(R['arrDims'],"Locations"),helper.paloEncode(locations),function(locationID){ // Get id			
			R["arrCellPath"]["Locations"] = locationID; 
			updateDimension(R['paloSID'],helper.getDimIdByName(R['arrDims'],"Years"),year,function(yearID){
				R["arrCellPath"]["Years"] = yearID; 
				updateDimension(R['paloSID'],helper.getDimIdByName(R['arrDims'],"Months"),month,function(monthID){
					R["arrCellPath"]["Months"] = monthID; 
					updateDimension(R['paloSID'],helper.getDimIdByName(R['arrDims'],"Days"),day,function(dayID){
						R["arrCellPath"]["Days"] = dayID; 
						updateDimension(R['paloSID'],helper.getDimIdByName(R['arrDims'],"Hours"),hour,function(hourID){
							R["arrCellPath"]["Hours"] = hourID; 							
							updateDimension(R['paloSID'],helper.getDimIdByName(R['arrDims'],"UserHierarchy"),helper.paloEncode(arrUser),function(userID){
								R["arrCellPath"]["UserHierarchy"] = userID; 
								updateDimension(R['paloSID'],helper.getDimIdByName(R['arrDims'],"Browsers"),arrBrowsers,function(browserID){
									R["arrCellPath"]["Browsers"] = browserID; 
									updateDimension(R['paloSID'],helper.getDimIdByName(R['arrDims'],"OperatingSystems"),OS,function(osID){
										R["arrCellPath"]["OperatingSystems"] = osID; 
										processAnEntry(0,G,R);
									})
								})
							})
						})
					})
				})
			})
		})
	})
}

function processAnEntry(i,G,R){							// Process an Entry (Note: 1 request may contain more than 1 entry - see front-end request sample)
	
	var E=new Array(); 	// 'E' is an array to store all Entry-related information
	E["arrCellPath"] = new Array();
	E['responsetime'] =R['arrOEntries'][i].responsetime;
	E['currentEntryIndex'] = i;
	E['statuscode'] = R['arrOEntries'][i].statuscode;	
	E['activity'] = R['arrOEntries'][i].activity;
	var statuscode = new Array();				//StatusCodes
	if(isNaN(E['statuscode'])) statuscode[statuscode.length]='undefined';
	E['statuscode'] = E['statuscode'].toString();
	statuscode[statuscode.length] = E['statuscode'];
	
	var arrActivities = E['activity'];			//Activity		
	if (TEST){ console.log("ArrActivities:"); console.log(arrActivities);}
	
	updateDimension(R['paloSID'],helper.getDimIdByName(R['arrDims'],"Statuscodes"),statuscode,function(statuscodeID){
		E["arrCellPath"]["Statuscodes"] = statuscodeID; 
		updateDimension(R['paloSID'],helper.getDimIdByName(R['arrDims'],"Activities"),helper.paloEncode(arrActivities),function(activityID){
			E["arrCellPath"]["Activities"] = activityID; 			
			E["arrCellPath"]["Measurement"]=CONFIG.NUMBER_OF_REQUEST_ELEMENT_ID;
			if (TEST) console.log("Array cell path: "); console.log(E["arrCellPath"]);
			
			var cellPath = helper.generateCellPath(R["arrDims"],R["arrCellPath"],E["arrCellPath"]);	// CELL PATH TO PUT NEW VALUE
			if (TEST) console.log('Cell path to update NumberOfRequests: ' + cellPath);

			palo.setCell(R['paloSID'],CONFIG.DATABASE_ID,R['cubeId'],cellPath,1,function(){			// UPDATE CELL VALUE
				E['arrCellPath']['Measurement']=CONFIG.RESPONSE_TIME_ELEMENT_ID;
				var path2 = helper.generateCellPath(R['arrDims'],R['arrCellPath'],E['arrCellPath']);
                if (TEST) console.log('Cell path to update ResponseTime: ' + path2);
					palo.setCell(R['paloSID'],CONFIG.DATABASE_ID,R['cubeId'],path2,E['responsetime'],function(){
						if (E['currentEntryIndex']<(R['arrOEntries'].length-1)){				
							processAnEntry(E['currentEntryIndex']+1,G,R);	 						// CONTINUE NEXT FRONT-END ENTRY
						} else {
							processARequest_continue(G,R);											// CHANGE TO NEXT REQUEST
						}
					})
			})
		})
	})
}

function processARequest_continue(G,R){
	logger.appendLogFile(R['log'].content,function(){
		redisClient.del(G['arrKeys'][R['currentRequestIndex']],function(){
			if (R['currentRequestIndex']<(G['arrKeys'].length-1)){		
				process((R['currentRequestIndex']+1),G);
			}else {		
				setTimeout(main,TIME_RESTART);
			}	
		})
	})
}

/* ===================================================================
Function: updateDimension 
Input: 
 + sid: Palo session id 
 + dimId: dimension id to update 
 + inputArrayElements: an array containing all elements (from client request)
 + callback function
Output:
 + return callback function with parameter: ELEMENT_ID of the lowest-level element in inputArrayElements 
Note:
 + If one or some elements in inputArrayElements not exist in Palo DB --> this function will create new element(s) 
=====================================================================*/
function updateDimension(sid,dimId,inputArrayElements,callback){	
	palo.getElements(sid, CONFIG.DATABASE_ID,dimId, function(arrayDimensionElements){
		for(var i =0;i<arrayDimensionElements.length;i++){
			if (arrayDimensionElements[i].depth == 0){
				parentId = arrayDimensionElements[i].id;
				updateDimensionAtDepth(1,sid,dimId,parentId,arrayDimensionElements,inputArrayElements,function(id){
					return callback(id) ;
				})
				break; // There must be only 1 node at depth 0
			}
		}
	})
}

// Recursively processing all depths of dimension hierarchy (tree)
function updateDimensionAtDepth(depth,sid,dimId,parentId,arrayDimensionElements,inputArrayElements,callback){
	if (TEST) console.log("*** Update Dimension At Depth");//+depth+" -- "+sid+" -- "+dimId+" -- "+parentId+" -- "+arrayDimensionElements+" -- "+inputArrayElements);
	console.log(arrayDimensionElements);
	console.log(inputArrayElements);
	var elementExisted = false;
	for(var i=0;i<arrayDimensionElements.length;i++){
		if(arrayDimensionElements[i].depth != depth) continue ;
		if (arrayDimensionElements[i].name==inputArrayElements[depth-1]) { 
			elementExisted=true;
			parentId=arrayDimensionElements[i].id;			
			break;
		}
	}
	
	if (!elementExisted){
		var type;
		if(depth<inputArrayElements.length) 
			type=CONFIG.PALO_CONSOLIDATE_TYPE_ID;
		else
			type=CONFIG.PALO_NUMERIC_TYPE_ID;
		inputArrayElements[depth-1]=inputArrayElements[depth-1].replace(/ /g,"+");
		palo.createElement(sid,CONFIG.DATABASE_ID,dimId,inputArrayElements[depth-1],type,function(childId){		
			palo.appendElement(sid,CONFIG.DATABASE_ID,dimId,parentId,childId,function(){
				parentId = childId;
				if (depth<inputArrayElements.length){
					updateDimensionAtDepth(depth+1,sid,dimId,parentId,arrayDimensionElements,inputArrayElements,callback);
				} else {
					return callback(childId);
				}
			});
		});
	}else{
		if(depth<inputArrayElements.length){
			updateDimensionAtDepth(depth+1,sid,dimId,parentId,arrayDimensionElements,inputArrayElements,callback);
		}else{
			 return callback(parentId);
		}
	}
}
