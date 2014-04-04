var CONFIG=require("../config.js");
var Sequelize = require("sequelize");
var sequelize = new Sequelize(CONFIG.DATABASE.NAME, CONFIG.DATABASE.USER, CONFIG.DATABASE.PASS);
var fs = require('fs');
 
exports.showAutoComplete = function(req, res){
	res.render('autoComplete', { title: 'jQuery Autocomplete - Node(Jade) - SequelizeJS - MySQL' });
};
exports.downloadCSV = function(req, res){
	var tableName=req.query['tableName'];
	var content="";
	sequelize.query("DESCRIBE `"+tableName+"`").success(function(arr){
		var arrFieldNames=new Array();
		var count=0;
		for (var field in arr){
			if (field=="id") continue;
			arrFieldNames[arrFieldNames.length]=field;
			if (count==0) content+=field;
			else content+=","+field;
			count++;
		}
		content+="\n";
		sequelize.query("SELECT * FROM `"+tableName+"`").success(function(arrRecords) {
			for (var i=0; i<arrRecords.length; i++){
				var r=arrRecords[i];
				count=0;
				for (var j=0; j<arrFieldNames.length; j++){
					if (count!=0) content+=",";
					// FORMAT
					var rContent=r[arrFieldNames[j]];
					if (!isNaN(rContent)){
						content+=rContent;
					}	else {						
						rContent=rContent.replace(/"/g,'""');
						content+='"'+rContent+'"';
					}
					count++;
				}
				content+="\n";
			}
			var path = "./public/files/helpTable.csv";
			fs.writeFile(path, content, function (err) {
				if(err) {
					console.log(err);
				} else {
					console.log("The file was saved!");					
					res.redirect(CONFIG.RELATIVE_PATH+'/files/helpTable.csv');
					res.end();
				}				
			});
		});
	});
	
};
exports.showHelpTable = function(req, res){
	var page;
	var tbl=req.query['tbl'];			
	if (tbl==undefined) page="tableList";
	else if (req.query['page']!=undefined) page=req.query['page'];
	else page="browse";	
	
	var arrParams={ page: page, tbl: tbl}; 
	
	// ====== HANDLE POST REQUEST ======= //
	if (page=="tableList"){
		res.render(page, { title: "Help Table", arrParams: arrParams });	
	} else if (page=="import"){
		if (req.body.action=="POST"){ // JSON format
			var content=req.body.content;			
			var arrRecords=JSON.parse(content);			
			console.log(arrRecords.length);
			sequelize.query("DESCRIBE `"+tbl+"`").success(function(arr){
				var arrFieldNames=new Array();
				for (var field in arr){
					console.log("~"+field);
					if (field=="id") continue;					
					arrFieldNames[arrFieldNames.length]=field;
				}
				importRecords(tbl, arrRecords, arrFieldNames, function(){
					res.render(page, { title: "Help Table", arrParams: arrParams});	
				});								
			});
		} else if (req.body.action=="Upload"){
			fs.readFile(req.files.filecsv.path, function (err, data) {			  				
				var fileContent=data.toString('utf8');
				var tmpArrRecords=fileContent.split("\n");
				tmpArrRecords.splice(0,1); // remove header row of csv file
				
				sequelize.query("DESCRIBE `"+tbl+"`").success(function(arr){
					var arrFieldNames=new Array();
					for (var field in arr){
						if (field=="id") continue;
						arrFieldNames[arrFieldNames.length]=field;
					}
					var arrRecords=new Array();
					for (var i=0; i<tmpArrRecords.length; i++){
						var line=tmpArrRecords[i];
						if (line=="") continue;
						// Get arrWords (cannot use line.split(",") because some value contains ",")						
						var arrWords=new Array();
						var doubleQuoteCount=0;
						var lastComma=-1;
						for (var k=0;k<line.length;k++){
							var c=line.charAt(k);
							if (c=='"') doubleQuoteCount++;
							if (c==','){
								if (doubleQuoteCount%2==0){
									// csv delimiter comma
									var word=line.substring(lastComma+1,k);
									arrWords[arrWords.length]=word;
									lastComma=k;
								}
							}
							if (k==line.length-1){
								var word=line.substring(lastComma+1,line.length);
								arrWords[arrWords.length]=word;
							}
						}
						
						var r=new Object();
						for (var j=0; j<arrFieldNames.length; j++){
							r[arrFieldNames[j]]=arrWords[j];
						}
						arrRecords[arrRecords.length]=r;
					}		
					importRecords(tbl, arrRecords, arrFieldNames, function(){
						res.render(page, { title: "Help Table", arrParams: arrParams });	
					});								
				});										
			});
		} else {
			res.render(page, { title: "Help Table" , arrParams: arrParams });	
		}
	} else {	
		res.render(page, { title: "Help Table" , arrParams: arrParams });	
	}
};

// ========================== HELPER FUNCTIONS ========================
function importRecords(tableName, arrRecords, arrFieldNames, callback){	
	console.log("1. "+arrRecords)
	console.log("2. "+arrFieldNames);	
	if (arrRecords.length==0){
		callback(); return;
	}
	var r=arrRecords[0];
	var sqlQuery="INSERT INTO `"+tableName+"` (`id`";
	
	for (var i=0; i<arrFieldNames.length; i++){					
		sqlQuery+=",`"+arrFieldNames[i]+"`";
	}
	sqlQuery+=") VALUES ('' ";
	for (var i=0; i<arrFieldNames.length; i++){
		var field=arrFieldNames[i];
		var val=r[field];
		if (isNaN(val)){
			if (val.substring(0,1)=='"') val=val.substring(1,val.length-1); // cut off double quote at begin and end
			val=val.replace(/""/g,'"');
		}
		
		sqlQuery+=", '"+val+"'";
	}
	sqlQuery+=");";		
	sequelize.query(sqlQuery).success(function(data) {
		arrRecords.splice(0,1);
		importRecords(tableName, arrRecords, arrFieldNames, callback);
	});	
}