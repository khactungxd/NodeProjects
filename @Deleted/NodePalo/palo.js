//======================== CONFIG & INCLUDE ==============================
var http=require("http")
   , helper=require("./helper")
    ,fs =require("fs")
	,crypto = require("crypto")
	,logger = require("./logger");
	
var HOST = 'localhost'
	, PORT = 7777
	, USERNAME = "admin"
	, PASSWORD = crypto.createHash('md5').update("admin").digest("hex")	
	, TIME_REPLAY = 5000
	, MODE="test" ;

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
			console.log("Got error: " + e.message);
			var content= helper.getTime("Error connect to Palo Server") ;
			console.log(content);
			/*
			fs.appendFile('./error.txt',content,function(err){
				setTimeout(connect,TIME_REPLAY);
			});
			*/			
			logger.appendErrorFile(content,function(){
				setTimeout(connect,TIME_REPLAY);
			})
			
		});
	}
} 

exports.getDimensions=function(sid,db_id,callback){
	var options = { host: HOST, port: PORT, path: '/database/dimensions?sid='+sid+'&database='+db_id+''};
	http.get(options, function(resp) {
		resp.setEncoding('utf8');	
		resp.on('data',function(chunk){									
			callback(helper.parseDimensions(chunk));	
		});
	});	
}

exports.getElements=function(sid, db_id, dimId, callback){
	var options={ host: HOST, port: PORT, path: '/dimension/elements?sid='+sid+'&database='+db_id+'&dimension='+dimId};
	http.get(options,function(resp){
		resp.setEncoding('utf8');	
		resp.on('data',function(chunk){
			return callback(helper.parseElements(chunk));
		});
	});
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
		console.log(chunk);
			callback(helper.parseCubes(chunk));	
		});
	})
}

exports.createElement = function(sid,db_id,dimIdPath,elementName,elementType,callback){
	elementName=elementName.replace(" ","+");
	var options = {
		host:HOST,
		port : PORT,
		path :'/element/create?sid='+sid+'&database='+db_id+'&dimension='+dimIdPath+'&new_name='+elementName+'&type='+elementType
	};
	http.get(options,function(resp){
		resp.setEncoding('utf8');
		resp.on('data',function(chunk){
		console.log(chunk);
			var tmpArr=helper.parseElements(chunk); 
			//var newE=tmpArr[0];		
			callback(tmpArr[0].id);
		});
	})
};

exports.createCube = function (sid,db_id,newCubeName,dimensionsPath,callback){
	var options = {
		host : HOST,
		port : PORT,
		path :'/cube/create?sid='+sid+'&database='+db_id+'&new_name='+newCubeName+'&dimensions='+dimensionsPath
	};
	console.log(options.path);
	http.get(options,function(resp){
		resp.setEncoding('utf8');
		resp.on('data',function(chunk){
			console.log(chunk);
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
	if (MODE=="test") console.log("DB - getCell");
	dataType = typeof dataType !== 'undefined' ? dataType : "string";
	
	var options={
		host:HOST,
		port:PORT,
		path:'/cell/value?sid='+sid+'&database='+db_id+'&cube='+cubeID+'&path='+cellPath
	};
	var req= http.get(options,function(resp){
		resp.setEncoding('utf8');
		resp.on('data',function(chunk){
			//console.log("chunk = "+chunk);
			var arrCell=chunk.split(';');
			var cellValue;
			if (dataType=="int"){
				//console.log("db int "+arrCell[1]+" -- "+arrCell[2]);
				if (arrCell[1]==0) cellValue=0; // this cell is not existed
				else cellValue=parseInt(arrCell[2]);
			} else if (dataType=="float"){
				if (arrCell[1]==0) cellValue=0; // this cell is not existed
				else cellValue=parseFloat(arrCell[2]);
			} else if (dataType=="string"){
				if (arrCell[1]==0) cellValue=""; // this cell is not existed
				else cellValue=arrCell[2];
			}			
			if (MODE=="test") console.log("DB - end getCell: "+cellValue);
			callback(cellValue);			
		});		
	}).on('error', function(e) {
		console.log("GET CELL ERROR: " + e.message+ " (path: "+options.path+")");
	});
	req.shouldKeepAlive = false;
	req.end();
};

exports.setCell = function(sid,db_id,cubeID,cellPath,newValue,callback){	
	if (MODE=="test") console.log("DB - setCell");
	var options={
		host:HOST,
		port:PORT,
		path:'/cell/replace?sid='+sid+'&database='+db_id+'&cube='+cubeID+'&path='+cellPath+'&value='+newValue+'&add=1'
	};
	var req=http.get(options,function(resp){
		resp.setEncoding('utf8');
		resp.on('data',function(chunk){
			if (MODE=="test") console.log("DB - end setCell: "+chunk);
			return callback();
		});
	}).on('error', function(e) {
		console.log("SET CELL ERROR: " + e.message+ " (path: "+options.path+")");
	});			
	req.shouldKeepAlive = false;
	req.end();
};
