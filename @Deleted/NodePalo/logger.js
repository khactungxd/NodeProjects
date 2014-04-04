ERROR_FILE = "./error.txt";
LOG_FILE = "./log.txt";
var fs = require ('fs');
exports.createRequestLog = function (){
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
exports.appendLogFile = function(content,callback){
	fs.appendFile(LOG_FILE,content,function(err){
		return callback();
	})
};
exports.appendErrorFile = function(content,callback){
	fs.appendFile(ERROR_FILE,content,function(err){
		return callback();
	})
};