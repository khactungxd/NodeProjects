var http = require ('http')
	,fs = require('fs')
	,palo = require ('../palo')
	,config=require('../config.js')
	,helper = require('../helper');
	
// *** MAIN FUNCTION TO PROCESS HTTP POST REQUEST ***	
exports.main=function(req,res){
	palo.login(function(paloSID){
		palo.getFullDimensions(paloSID,config.DATABASE_ID,function(arrDimensions){ 	 // all dimensions with elements inside			
			var date = new Date();
			var year = date.getFullYear();
			var month = date.getMonth()+1;
			var day = date.getDate();
			
			var params=getParamters(req, arrDimensions);	
			params['Years'] = year;//get year
			var cellPath1=getPath(params, arrDimensions);
			//console.log(cellPath1);
			if (month<10) params['Months']="0"+month+".Month";//get month
			else params['Months']=month+".Month";		
			var cellPath2=getPath(params, arrDimensions);
			//console.log(cellPath2);
			if (day<10) params['Days']="0"+day+".Day";//get day
			else params['Days']=day+".Day";		
			var cellPath3=getPath(params, arrDimensions);
			//console.log(cellPath3);
			if(!params['supermandant']){
				var error = {"error":"Please,chose SuperMandant"};
				res.send(JSON.stringify(error));					
			}else{
				 palo.getCubes(paloSID,config.DATABASE_ID,function(cubes){	
					var cubeID=helper.getCubeIdByName(cubes, params['supermandant']);
					if (cubeID!=undefined){
						palo.getCellValues(paloSID,config.DATABASE_ID,cubeID,cellPath3,function(arrCellValues3){
							var arr = new Object();
							arr.today = new Object();
							arr.today.number_of_requests = arrCellValues3[0];
							arr.today.response_time = arrCellValues3[1];
							palo.getCellValues(paloSID,config.DATABASE_ID,cubeID,cellPath2,function(arrCellValues2){
								arr.this_month = new Object();
								arr.this_month.number_of_requests = arrCellValues2[0];
								arr.this_month.response_time = arrCellValues2[1];
								palo.getCellValues(paloSID,config.DATABASE_ID,cubeID,cellPath1,function(arrCellValues1){
									arr.this_year = new Object();
									arr.this_year.number_of_requests = arrCellValues1[0];
									arr.this_year.response_time = arrCellValues1[1];
									//res.send(cubeID);
									res.send(JSON.stringify(arr));
								})
							})
						})
					} else {
						//printError(res,"Cube doesn't exist");					
						//return;			
						//console.log('PE');	
						var error = {"error":"Not have this SuperMandant"};
						res.send(JSON.stringify(error));					
					}
				 })
			} 
		})
	})
}

function getParamters(req, arrDimensions){
	var params={};	
	params=helper.getDictionaryRootElements(arrDimensions);	
	params['apiName'] = "get_recent_data";
	params['supermandant'] = req.query["supermandant"];		
	if (req.query['mandant']) params['UserHierarchy']= req.query["mandant"];
	if (req.query['location']) params['Locations']= req.query["location"];
	return params;
}

function getPath(params,arrDimensions){		
	var arrMeasurementElementList=helper.getMeasurementElementList(arrDimensions); // return array(0,1)
	var nDimensions=arrDimensions.length;
	var measurementDimensionPosition = helper.getDimensionPosition(arrDimensions,"Measurement");
	var fullPath="";
	for (var i=0;i<arrMeasurementElementList.length;i++){
		var path="";
		for (var k=0; k<nDimensions; k++){
					//params[ arrDimensions[k].name] = params[ arrDimensions[k].name].replace("+"," ");
					//params[ arrDimensions[k].name] = params[ arrDimensions[k].name].replace("%20","");
			if (k!= measurementDimensionPosition){
				path+=helper.getElementId(arrDimensions[k].elements, params[ arrDimensions[k].name] ) ;			
			}
			else if (k==measurementDimensionPosition){
				path+=arrMeasurementElementList[i];
			}
			if (k<(nDimensions-1)) path+=",";
		}
		fullPath+=path;
		if (i!=(arrMeasurementElementList.length-1)){
			fullPath+=":";
		}
	}
	return fullPath;
}