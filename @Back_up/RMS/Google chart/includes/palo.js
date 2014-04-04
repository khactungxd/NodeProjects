// =========================== DEPENDENCIES ==============================
var http = require("http"); 
var helper=require("./node_helper.js");
var fs =require("fs");
var crypto = require("crypto");
var logger = require("./logger.js");

// =========================== CONFIG ==============================	
var TEST=true;
var PORT = 7777;
var HOST = 'localhost';
var USERNAME = "admin";
var PASSWORD = crypto.createHash('md5').update("admin").digest("hex");
var TIME_REPLAY = 5000;

// =========================== PALO FUNCTIONS ==============================	

exports.login=function(callback){	
	var options= { host: HOST, port: PORT, path: '/server/login?user='+USERNAME+'&password='+PASSWORD};
	connect();
	function connect(){
		 http.get(options, function(resp) {
			resp.setEncoding('utf8');
			resp.on('data',function(chunk){
				callback(chunk.substring(0,4));
			});
		}).on('error', function(e) {
			var errContent="Connect Palo error: " + e.message;
			logger.appendErrorFile(errContent,function(){
				setTimeout(connect,TIME_REPLAY);
			})			
		});
	}
} 

exports.getFullDimensions=function(sid,db_id,callback){
	var R = new Array();
	var arrDimensions = new Array();
	R['paloSID'] = sid;
	var thisPalo=this;
	thisPalo.getDimensions(R['paloSID'],db_id,function(dimensions){
			getFullDimensions_step(0,db_id,R,arrDimensions,dimensions,thisPalo,callback);
	})
}

function getFullDimensions_step(i,db_id,R,arrDimensions,dimensions,thisPalo,callback){
	if (TEST) console.log("*** getFullDimensions");
	R['currentIndex'] = i;
	arrDimensions[i]= new Array();
	arrDimensions[i].id = dimensions[i].id;
	arrDimensions[i].name = dimensions[i].name;
	arrDimensions[i].elements = new Array();
	thisPalo.getElements(R['paloSID'],db_id,arrDimensions[i].id,function(elements){
		arrDimensions[i].elements = elements;
		if (R['currentIndex']  < (dimensions.length-1)){
			getFullDimensions_step(i+1,db_id,R,arrDimensions,dimensions,thisPalo,callback);
		}else{
			callback(arrDimensions);
		}
	})
}
exports.getDimensions=function(sid,db_id,callback){
	var options = { host: HOST, port: PORT, path: '/database/dimensions?sid='+sid+'&database='+db_id};
	http.get(options, function(resp) {
		resp.setEncoding('utf8');	
		resp.on('data',function(chunk){									
			callback(helper.parseDimensions(chunk));	
		});
	});	
}

exports.getElements=function(sid, db_id, dimId, callback){
	if (TEST) console.log("*** getElements");
	var options={ host:HOST, port: PORT, path: '/dimension/elements?sid='+sid+'&database='+db_id+'&dimension='+dimId};
	http.get(options,function(resp){
		resp.setEncoding('utf8');	
		resp.on('data',function(chunk){
			if (TEST) console.log("~~~~ GetElement Return: "+helper.parseElements(chunk));
			return callback(helper.parseElements(chunk));
		});
	});
};

exports.getCellValues = function(sid,db_id,cubeId,path,callback){ // ex cellPath: //6,13,31,1,6,2,0,0,0:6,13,31,1,6,135,0,0,0:6,13,31,1,6,136,0,0,0
	var options = {
		host : HOST,
		port : PORT,
		path :'/cell/values?sid='+sid+'&database='+db_id+'&cube='+cubeId+'&paths='+path
	};
	//console.log("path = "+options.path);
	http.get(options,function(resp){
		resp.setEncoding('utf8');
		resp.on('data',function(chunk){
			return callback(helper.parseCells(chunk)); // array(9,900,8,800..);
		});
	})
};
exports.getCellValue = function(sid,db_id,cubeId,path,callback){
	var options = {
		host : HOST,
		port : PORT,
		path :'/cell/value?sid='+sid+'&database='+db_id+'&cube='+cubeId+'&path='+path
	};
	http.get(options,function(resp){
		resp.setEncoding('utf8');
		resp.on('data',function(chunk){
			return callback(helper.parseCell(chunk));
		});
	})
}
exports.getCubes = function (sid,db_id,callback){
	 var options = {
	  host:HOST,
	  port:PORT,
	  path : '/database/cubes?sid='+sid+'&database='+db_id
	 };
	 http.get(options,function(resp){
		resp.setEncoding('utf8');
		resp.on('data',function(chunk){	  
			callback(helper.parseCubes(chunk)); 
		});
	 })
}
exports.createElement = function(sid,db_id,dimIdPath,elementName,elementType,callback){
	if (TEST) console.log("*** Create Element: [1]"+dimIdPath+" -- [2]"+elementName+" -- [3]"+elementType);
	elementName=elementName.replace(" ","+");	
	var options = {
		host:HOST,
		port : PORT,
		method: 'GET',
		path :'/element/create?sid='+sid+'&database='+db_id+'&dimension='+dimIdPath+'&new_name='+elementName+'&type='+elementType
	};	
	var newElementId="";
		
	var req = http.request(options,function(res){
		res.setEncoding('utf8');
		console.log("Connected");
		res.on('data',function(data){
			if (TEST) console.log("Create Element Data: "+data);
			var tmpArr=helper.parseElements(data); 
			newElementId=tmpArr[0].id;	
			if (TEST) console.log("Create Element Return: "+newElementId);
			callback(newElementId);			
		});
	});
	
	req.on('socket', function (socket) {
		socket.setTimeout(5000);  
		socket.on('timeout', function() {
			req.abort();
			if (TEST) console.log("Request too long --> aborted !!!");
		});
	});
	req.end();
};
exports.createCube = function (sid,db_id,newCubeName,dimensionsPath,callback){
	var options = {
		host : HOST,
		port : PORT,
		path :'/cube/create?sid='+sid+'&database='+db_id+'&new_name='+newCubeName+'&dimensions='+dimensionsPath
	};
	
	http.get(options,function(resp){
		resp.setEncoding('utf8');
		resp.on('data',function(chunk){			
			var tmpArr = helper.parseCubes(chunk);
			return callback(tmpArr[0].id);
		});
	})
}
exports.appendElement = function(sid,db_id,dimId,parentId,childId,callback){
	var options = {
		host :HOST,
		port :PORT,
		path: '/element/append?sid='+sid+'&database='+db_id+'&dimension='+dimId+'&element='+parentId+'&children='+childId
	};
	http.get(options,function(resp){
		return callback();
	})
};

exports.getCell = function(sid,db_id,cubeID,cellPath,dataType,callback){  // dataType = int/float/string	
	dataType = typeof dataType !== 'undefined' ? dataType : "string";
	
	var options={
		host:HOST,
		port:PORT,
		path:'/cell/value?sid='+sid+'&database='+db_id+'&cube='+cubeID+'&path='+cellPath
	};
	var req= http.get(options,function(resp){
		resp.setEncoding('utf8');
		resp.on('data',function(chunk){
			var arrCell=chunk.split(';');
			var cellValue;
			if (dataType=="int"){
				if (arrCell[1]==0) cellValue=0; // this cell is not existed
				else cellValue=parseInt(arrCell[2]);
			} else if (dataType=="float"){
				if (arrCell[1]==0) cellValue=0; // this cell is not existed
				else cellValue=parseFloat(arrCell[2]);
			} else if (dataType=="string"){
				if (arrCell[1]==0) cellValue=""; // this cell is not existed
				else cellValue=arrCell[2];
			}			
			callback(cellValue);			
		});		
	}).on('error', function(e) {
		console.log("GET CELL ERROR: " + e.message+ " (path: "+options.path+")");
	});
	req.shouldKeepAlive = false;
	req.end();
};

exports.setCell = function(sid,db_id,cubeID,cellPath,newValue,callback){	
	var options={
		host:HOST,
		port:PORT,
		path:'/cell/replace?sid='+sid+'&database='+db_id+'&cube='+cubeID+'&path='+cellPath+'&value='+newValue+'&add=1'
	};
	var req=http.get(options,function(resp){
		resp.setEncoding('utf8');
		resp.on('data',function(chunk){
			return callback();
		});
	}).on('error', function(e) {
		console.log("SET CELL ERROR: " + e.message+ " (path: "+options.path+")");
	});			
	req.shouldKeepAlive = false;
	req.end();
};