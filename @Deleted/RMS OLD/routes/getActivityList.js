var http = require ('http')
	,fs = require('fs')
	,palo = require ('../palo')
	,config=require('../config.js')
	,helper = require('../helper');

	// *** MAIN FUNCTION TO PROCESS HTTP POST REQUEST ***	
exports.main=function(req,res){
	palo.login(function(paloSID){																					 // login to Palo
		palo.getFullDimensions(paloSID,config.DATABASE_ID,function(arrDimensions){ 
			//var arrTargetElementList=helper.getElementsArrayByDFS(arrDimensions,"Locations");  // return array(0,1,2,4,3);
			//console.log(arrTargetElementList);
			var data ="";
			for(var i=0;i<arrDimensions.length;i++){
				if(arrDimensions[i].name == "Activities"){
					var inputArray = arrDimensions[i].elements;
					var outputArray=recursion_getElementsTree(0,"",inputArray) ;			
					countStatic(1); // reset count
					data=outputArray[0];			
					break;
				}
			}
			console.log(data);
			res.send(JSON.stringify(data));
		})
	})
}

function recursion_getElementsTree(depth,parentId,inputArray){		
//	console.log("recursionGetElements depth:"+depth+" parentId:"+parentId);
	var outputArray = new Array();
	
	for(var i=0 ; i<inputArray.length ;i++){
		if(inputArray[i].depth != depth) continue;
		if(inputArray[i].parent != parentId) continue;
		var e={};
		//e.id=inputArray[i].id;
		e.name=inputArray[i].name;
		e.children=recursion_getElementsTree(depth+1,inputArray[i].id,inputArray);
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