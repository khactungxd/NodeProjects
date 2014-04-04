var http = require ('http')
	,fs = require('fs')
	,palo = require ('../palo')
	,config=require('../config.js')
	,helper = require('../helper');

	// *** MAIN FUNCTION TO PROCESS HTTP POST REQUEST ***	
exports.main=function(req,res){
	palo.login(function(paloSID){																					 // login to Palo
		//all cubes 
		palo.getCubes(paloSID,config.DATABASE_ID,function(arrCubes){
			var arr = new Array();
			for(var i=0;i<arrCubes.length;i++){
				console.log(arrCubes[i].name);
				arr[arr.length] = arrCubes[i].name;
			}
			res.send(arr);
		})
	})
}
