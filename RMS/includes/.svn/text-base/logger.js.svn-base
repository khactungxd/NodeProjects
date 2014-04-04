var fs = require ('fs');

ERROR_FILE = "../log/error.txt";
LOG_FILE = "../log/log.txt";

exports.createRequestLog = function (){ //Generate log content only (not write to file)
	var date = new Date();
	var year = date.getFullYear();
	var month = date.getMonth()+1;
	var  day = date.getDay();
	var hour = date.getHours();
	var minute = date.getMinutes();
	var second = date.getSeconds();
	var millisecond = date.getMilliseconds();
	
	var object={};
	object.content="============================================================================ \r\n";
	object.content+="#Request :  "+year+"-"+month+"-"+ day+"  "+hour+":"+minute+":"+second+"."+millisecond+"\r\n";
	object.content+="============================================================================ \r\n";
	object.insertStatus = function (status){
		this.content += status +"\r\n";
	};
	object.insert=function(name,value){
		this.content+="+ "+name+" : "+value+"\r\n";
	}
	return object;
};
exports.appendLogFile = function(content,callback){		// Write to log.txt file
	content+=getCurrentTime();
	fs.appendFile(LOG_FILE,content,function(err){
		return callback();
	})
};
exports.appendErrorFile = function(content,callback){	// Write to error.txt file
	content+=getCurrentTime();
	fs.appendFile(ERROR_FILE,content,function(err){
		return callback();
	})
};

// ========================= HELPER ========================
function getCurrentTime (){
	var date = new Date();
	var year = date.getFullYear();
	var month = date.getMonth()+1;
	var  day = date.getDay();
	var hour = date.getHours();
	var minute = date.getMinutes();
	var second = date.getSeconds();
	var millisecond = date.getMilliseconds();
	return year+"-"+month+"-"+ day+"  "+hour+":"+minute+":"+second+"."+millisecond;	
}