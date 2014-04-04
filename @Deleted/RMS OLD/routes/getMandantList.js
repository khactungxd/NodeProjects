var http = require ('http')
	,fs = require('fs')
	,palo = require ('../palo')
	,config=require('../config.js')
	,helper = require('../helper');

	// *** MAIN FUNCTION TO PROCESS HTTP POST REQUEST ***	
exports.main=function(req,res){
	palo.login(function(paloSID){																					 // login to Palo
		palo.getDimensions(paloSID,config.DATABASE_ID,function(dimensions){
			for(var i =0;i<dimensions.length;i++){
				if(dimensions[i].name == "UserHierarchy"){
					palo.getElements(paloSID,config.DATABASE_ID,dimensions[i].id,function(elements){
						var arrMandant = new Array();
						for(var i=0;i<elements.length;i++){
							if(elements[i].depth != 1) continue;
							
							arrMandant[arrMandant.length] = elements[i].name;
						}
						//return;
						console.log(arrMandant);
						res.send(JSON.stringify(arrMandant));
					})
					break;
				}
			}
		})
	})
}
