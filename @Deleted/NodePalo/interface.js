// ========================== INCLUDE =============================
var http= require('http')
	, redis = require('redis')	
	,crypto = require('crypto');
// ===============================================================

exports.post = function(req,res){
	res.send("Received");
	main(req.body.message, req.headers['user-agent']);	
}


/* ====================================== MAIN ======================================
Purpose: Push frontend request into Redis database
===================================================================================*/

function main(message,userAgent){
	var redis_client = redis.createClient();
	var oMessage=JSON.parse(message);
	oMessage.userAgent=userAgent;
	var id=oMessage.id;
	console.log("ID = "+id);
	var now=new Date().getTime();
	var meta={"userAgent":userAgent, "time":now};
	meta=JSON.stringify(meta);
	console.log("META = "+meta);
	
	var md5 =crypto.createHash('md5').update(JSON.stringify(message)).digest("hex");
	redis_client.HMSET("PaloRequest "+now+md5, "message",message,  "meta", meta, function(){
		redis_client.end();
	});
	
}