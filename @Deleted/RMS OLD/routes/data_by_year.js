var http = require ('http')
	,fs = require('fs')
	,palo = require ('../palo')
	,config=require('../config.js')
	,helper = require('../helper');

// *** MAIN FUNCTION TO PROCESS HTTP POST REQUEST ***	
exports.main=function(req,res){
	palo.login(function(paloSID){																					 // login to Palo
		palo.getFullDimensions(paloSID,config.DATABASE_ID,function(arrDimensions){ 	 // all dimensions with elements inside			
			var params=getParamters(req, arrDimensions);								 			 // all input parameters + combine with default values
			var fullCellPath=helper.getFullPath(params, arrDimensions,"Years");									 	 // get palo cell path to use in Palo HTTP API							
			console.log("Full Path = "+fullCellPath);
			palo.getCubes(paloSID,config.DATABASE_ID,function(cubes){				
				var cubeID=helper.getCubeIdByName(cubes, params['supermandant']);
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
	//params['apiName'] = "data_by_activity";
	params['supermandant'] = req.query["supermandant"];		
	if (req.query['mandant']) params['UserHierarchy']= req.query["mandant"];
	if (req.query['mandant']) params['Mandant']= req.query["mandant"];
	if (req.query['location']) params['Locations']= req.query["location"];
	if(req.query['activity']) params['Activities'] = req.query["activity"];
	return params;
}

function printJSON(res,params,arrDimensions, arrCellValues){
	var data = helper.generateJsonData(arrDimensions, "Years", arrCellValues);	
	res.send(JSON.stringify(data));
}
function printError(res,err){
	res.send(err);
}

