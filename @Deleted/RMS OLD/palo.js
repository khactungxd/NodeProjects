var http = require("http") , 
	helper=require("./helper");
	
var PORT = 7777
	, HOST = 'localhost'
	, MODE="test1";
	
exports.login=function(callback){	
	var options= { host: HOST, port: PORT, path: '/server/login?user=admin&password=21232f297a57a5a743894a0e4a801fc3'};		
	connect();
	function connect(){
		 http.get(options, function(resp) {
			resp.setEncoding('utf8');
			resp.on('data',function(chunk){
				callback(chunk.substring(0,4));
			});
		}).on('error', function(e) {
			console.log("Got error: " + e.message);
			setTimeout(connect,5000);
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
	if (MODE=="test") console.log("*** getFullDimensions");
	R['currentIndex'] = i;
	arrDimensions[i]= new Array();
	arrDimensions[i].id = dimensions[i].id;
	arrDimensions[i].name =dimensions[i].name;
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
	var options = { 
		host: HOST, 
		port: PORT, 
		path: '/database/dimensions?sid='+sid+'&database='+db_id
	};
	http.get(options, function(resp) {
		resp.setEncoding('utf8');	
		resp.on('data',function(chunk){									
			callback(helper.parseDimensions(chunk));	
		});
	});	
}

exports.getElements=function(sid, db_id, dimId, callback){
	if (MODE=="test") console.log("*** getElements");
	var options={ host:HOST, port: PORT, path: '/dimension/elements?sid='+sid+'&database='+db_id+'&dimension='+dimId};
	http.get(options,function(resp){
		resp.setEncoding('utf8');	
		resp.on('data',function(chunk){
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