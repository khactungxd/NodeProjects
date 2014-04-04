var Sequelize = require("sequelize");
var TABLE_NAME="tb_data";
var sequelize = new Sequelize('helptable2', 'root', 'blank');
var fs = require('fs');
 
exports.showListJS = function(req, res){
	res.render('listJS', { title: 'HELP TABLE' });
};

exports.showAutoComplete = function(req, res){
	res.render('autoComplete', { title: 'jQuery Autocomplete - Node(Jade) - SequelizeJS - MySQL' });
};
exports.downloadCSV = function(req, res){
	var content="";
	sequelize.query("DESCRIBE "+TABLE_NAME).success(function(arr){
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
		sequelize.query("SELECT * FROM "+TABLE_NAME).success(function(arrRecords) {
			for (var i=0; i<arrRecords.length; i++){
				var r=arrRecords[i];
				count=0;
				for (var j=0; j<arrFieldNames.length; j++){					
					if (count!=0) content+=",";
					content+=r[arrFieldNames[j]];
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
					res.redirect('/files/helpTable.csv');
					res.end();
				}				
			});
		});
	});
	
};
exports.showHelpTable = function(req, res){
	var page=req.query['page'];
	if (page==undefined) page="browse";
	
	// ====== HANDLE POST REQUEST ======= //
	if (page=="import"){
		if (req.body.action=="POST"){
			var content=req.body.content;			
			var arrRecords=JSON.parse(content);			
			console.log(arrRecords.length);
			sequelize.query("DESCRIBE "+TABLE_NAME).success(function(arr){
				var arrFieldNames=new Array();
				for (var field in arr){
					if (field=="id") continue;
					arrFieldNames[arrFieldNames.length]=field;
				}
				importRecords(arrRecords, arrFieldNames, function(){
					res.render(page, { title: "Help Table" });	
				});								
			});
		} else if (req.body.action=="Upload"){
			fs.readFile(req.files.filecsv.path, function (err, data) {			  				
				var fileContent=data.toString('utf8');
				var tmpArrRecords=fileContent.split("\n");
				tmpArrRecords.splice(0,1); // remove header row of csv file
				
				sequelize.query("DESCRIBE "+TABLE_NAME).success(function(arr){
					var arrFieldNames=new Array();
					for (var field in arr){
						if (field=="id") continue;
						arrFieldNames[arrFieldNames.length]=field;
					}
					var arrRecords=new Array();
					for (var i=0; i<tmpArrRecords.length; i++){
						var line=tmpArrRecords[i];
						if (line=="") continue;
						var arrWords=line.split(",");
						var r=new Object();
						for (var j=0; j<arrFieldNames.length; j++){
							r[arrFieldNames[j]]=arrWords[j];
						}
						arrRecords[arrRecords.length]=r;
					}		
					importRecords(arrRecords, arrFieldNames, function(){
						res.render(page, { title: "Help Table" });	
					});								
				});										
			});
		} else {
			res.render(page, { title: "Help Table"  });	
		}
	} else {	
		res.render(page, { title: "Help Table"  });	
	}
};

// ========================== HELPER FUNCTIONS ========================
function importRecords(arrRecords, arrFieldNames, callback){
	console.log("1. "+arrRecords)
	console.log("2. "+arrFieldNames);
	if (arrRecords.length==0){
		callback(); return;
	}
	var r=arrRecords[0];
	var sqlQuery="INSERT INTO `helptable`.`"+TABLE_NAME+"` VALUES ('' ";
	for (var i=0; i<arrFieldNames.length; i++){
		var field=arrFieldNames[i];
		var val=r[field];
		sqlQuery+=", '"+val+"'";
	}
	sqlQuery+=");";		
	sequelize.query(sqlQuery).success(function(data) {
		arrRecords.splice(0,1);
		importRecords(arrRecords, arrFieldNames, callback);
	});			
}