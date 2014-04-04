DB_ID=9;
NUMBER_OF_REQUEST_ELEMENT_ID = '0';
RESPONSE_TIME_ELEMENT_ID = '1';
TIME_REPLAY = 5000;
var http= require('http')
    , fs= require('fs')
	, helper = require('./helper')  
	, geonames = require('./geonames')
	, palo=require('./palo')
	, redis = require('redis')
    , uaModule= require('express-useragent')
	,logger = require('./logger');	
var redisClient = redis.createClient();	
// ===============================================================
main();

/* ====================================== MAIN ======================================
Purpose: Read Frontend requests From Redis database and update data to Palo DB via Palo HTTP API
NOTE: G is the main array which include almost necessary data (G=Global)
===================================================================================*/
function main(){	 	
	var G = new Array();
	redisClient.keys("PaloRequest*",function(err,data){
		G['arrKeys']=data;
		if(data.length >=1){
			process(0,G);
		}else {
			console.log("Null");
			setTimeout(main,TIME_REPLAY);//3600000
		}		
	});		
}
//GET 
function process(i, G){		
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
		//console.log(key);
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
				palo.getDimensions(R['paloSID'],DB_ID,function(dimensions){
					R['arrDims']=dimensions;
					palo.getCubes(R['paloSID'],DB_ID,function(cubes){
						var existed = false ;
						for(var i =0;i<cubes.length ;i++){
							if(cubes[i].name ==  R['supermandant']){
								R['cubeId'] = cubes[i].id;
								existed = true ;
								break;
							}
						} 
						if(!existed){
							var DIMENSION_PATH ;
							palo.createCube(R['paloSID'],DB_ID,R['supermandant'],helper.getDimensionsPath(dimensions),function(cubeId){
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

function processARequest(G,R){
	
	var year = new Array();                  //YEARS
	year[year.length] = R['Time'].year;
	var month = new Array();                 //MONTHS
	month[month.length] = R['Time'].month;
	var day = new Array();					 //DAYS
	day[day.length] = R['Time'].day;
	var hour = new Array();					 //HOURS
	hour[hour.length] = R['Time'].hour;
	var arrUser = new Array();				 //UserHierarchy
	arrUser[arrUser.length] = R.mandant;
	for(var i =0;i<R['orgunit'].length;i++){
		R['orgunit'][i] = R['orgunit'][i].replace(' ','');
		arrUser[arrUser.length] = 	R['orgunit'][i]+'@'+arrUser[arrUser.length -1]; 
	}
	R.username = R.username.replace(' ','');
	arrUser[arrUser.length] = R.username+'@'+arrUser[arrUser.length-1];
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
	//console.log(R['location']);
	//return;
	geonames.parseLocation(R['location']['countryCode'],R['location']['postalCode'],function(locations){
		//console.log(locations);
		
		updateDimension(R['paloSID'],helper.getDimIdByName(R['arrDims'],"Locations"),locations,function(locationID){ // Get id
			R["arrCellPath"]["Locations"] = locationID; 
			updateDimension(R['paloSID'],helper.getDimIdByName(R['arrDims'],"Years"),year,function(yearID){
				R["arrCellPath"]["Years"] = yearID; 
				updateDimension(R['paloSID'],helper.getDimIdByName(R['arrDims'],"Months"),month,function(monthID){
					R["arrCellPath"]["Months"] = monthID; 
					updateDimension(R['paloSID'],helper.getDimIdByName(R['arrDims'],"Days"),day,function(dayID){
						R["arrCellPath"]["Days"] = dayID; 
						updateDimension(R['paloSID'],helper.getDimIdByName(R['arrDims'],"Hours"),hour,function(hourID){
							R["arrCellPath"]["Hours"] = hourID; 
							updateDimension(R['paloSID'],helper.getDimIdByName(R['arrDims'],"UserHierarchy"),arrUser,function(userID){
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

function processAnEntry(i,G,R){
	//start new entry
		
	var E=new Array(); 
	E["arrCellPath"] = new Array();
	E['responsetime'] =R['arrOEntries'][i].responsetime;
	E['currentEntryIndex'] = i;
	E['statuscode'] = R['arrOEntries'][i].statuscode;
	E['activity'] = R['arrOEntries'][i].activity;
	var statuscode = new Array();				//StatusCodes
	if(isNaN(E['statuscode'])) statuscode[statuscode.length]='undefined';
	E['statuscode'] = E['statuscode'].toString();
	statuscode[statuscode.length] = E['statuscode'];
	var arrActivities = new Array();			//Activity
	E['activity'].group = E['activity'].group.replace(' ','');
	arrActivities[arrActivities.length] = E['activity'].group;
	E['activity'].cmd=E['activity'].cmd.replace(' ','');
	arrActivities[arrActivities.length]=E['activity'].group+'.' +E['activity'].cmd;
	updateDimension(R['paloSID'],helper.getDimIdByName(R['arrDims'],"Statuscodes"),statuscode,function(statuscodeID){
		console.log(statuscodeID);
		E["arrCellPath"]["Statuscodes"] = statuscodeID; 
		updateDimension(R['paloSID'],helper.getDimIdByName(R['arrDims'],"Activities"),arrActivities,function(activityID){
			E["arrCellPath"]["Activities"] = activityID; 
			processAnEntry_continue(G,R,E);
		})
	})
}

function processAnEntry_continue(G,R,E){ 
	// end an entry
	E["arrCellPath"]["Measurement"]=NUMBER_OF_REQUEST_ELEMENT_ID;
	console.log(E["arrCellPath"]);
	//return;
	//console.log("Measurement : " + E["arrCellPath"]["Measurement"]);
	var path1 = helper.generateCellPath(R["arrDims"],R["arrCellPath"],E["arrCellPath"]);
	console.log('Path 1' + path1);
//	return;
	palo.setCell(R['paloSID'],DB_ID,R['cubeId'],path1,1,function(){
		E['arrCellPath']['Measurement']=RESPONSE_TIME_ELEMENT_ID;
		var path2 = helper.generateCellPath(R['arrDims'],R['arrCellPath'],E['arrCellPath']);
			palo.setCell(R['paloSID'],DB_ID,R['cubeId'],path2,E['responsetime'],function(){
				if (E['currentEntryIndex']<(R['arrOEntries'].length-1)){				
					processAnEntry(E['currentEntryIndex']+1,G,R);	 // CONTINUE NEXT FRONT-END ENTRY
				} else {
					processARequest_continue(G,R);
				}
			})
	})
}

function processARequest_continue(G,R){
	// end a request
	logger.appendLogFile(R['log'].content,function(){
		redisClient.del(G['arrKeys'][R['currentRequestIndex']],function(){
			if (R['currentRequestIndex']<(G['arrKeys'].length-1)){		
				process((R['currentRequestIndex']+1),G);
			}else {	
				setTimeout(main,TIME_REPLAY);
			}	
		})
	})
	/*
	fs.appendFile('./log.txt',R['log'].content,function(err){
		redisClient.del(G['arrKeys'][R['currentRequestIndex']],function(){
			if (R['currentRequestIndex']<(G['arrKeys'].length-1)){		
				process((R['currentRequestIndex']+1),G);
			}else {	
				setTimeout(main,TIME_REPLAY);
			}	
		})
	})
	*/
}
/* ===================================================================
Function: updateDimension 
=====================================================================*/

function updateDimension(sid,dimId,inputArrayElements,callback){
	palo.getElements(sid, DB_ID,dimId, function(arrayDimensionElements){
		for(var i =0;i<arrayDimensionElements.length;i++){
			if (arrayDimensionElements[i].depth == 0){
				parentId = arrayDimensionElements[i].id;
				updateDimensionAtDepth(1,sid,dimId,parentId,arrayDimensionElements,inputArrayElements,function(id){
					return callback(id) ;
				})
				break;
			}
		}
	})
}

function updateDimensionAtDepth(depth,sid,dimId,parentId,arrayDimensionElements,inputArrayElements,callback){
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
		var type;// 1: numeric. 4: consolidate
		if(depth<inputArrayElements.length) 
			type=4;
		else
			type=1;
		inputArrayElements[depth-1]=inputArrayElements[depth-1].replace(/ /g,"+");
		palo.createElement(sid,DB_ID,dimId,inputArrayElements[depth-1],type,function(childId){		
			palo.appendElement(sid,DB_ID,dimId,parentId,childId,function(){
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
