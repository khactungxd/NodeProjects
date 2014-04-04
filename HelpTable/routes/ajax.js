var CONFIG=require("../config.js");
var Sequelize = require("sequelize");
//var TABLE_NAME="tb_data";
var sequelize = new Sequelize(CONFIG.DATABASE.NAME, CONFIG.DATABASE.USER, CONFIG.DATABASE.PASS);


exports.index = function(req, res){  		

	// =========================================================================================
	// ===================== DATABASE STRUCTURE (table list...) ======================================
	if(req.query["action"]=="getTableList"){
		sequelize.query("SHOW TABLES").success(function(data) {
			res.send(data);
		});
	} else if(req.query["action"]=="renameTable"){
		var oldTableName=req.query['oldTableName'];
		var newTableName=req.query['newTableName'];
		sequelize.query("RENAME TABLE `"+oldTableName+"` TO `"+newTableName+"` ;").success(function(data) {
			res.send("Success");
		});
	} else if(req.query["action"]=="removeTable"){
		var tableName=req.query['tableName'];
		sequelize.query("DROP TABLE `"+tableName+"` ;").success(function(data) {
			res.send("Success");
		});
	} else if(req.query["action"]=="addTable"){
		var tableName=req.query['tableName'];
		sequelize.query("CREATE TABLE `"+tableName+"` (id INT NOT NULL AUTO_INCREMENT, PRIMARY KEY (id) ) ;").success(function(data) {
			res.send("Success");
		});
	}
	
	// =========================================================================================
	// ===================== TABLE STRUCTURE (ADD/REMOVE/UPDATE FIELDS) ========================
	
	if(req.query["action"]=="editAField"){		
		var tableName=req.query['tableName'];
		var oldFieldName=req.query['oldFieldName'];
		var newFieldName=req.query['fieldName'];
		newFieldName=newFieldName.replace(/['"]/g, "\"");
		var fieldType=req.query['fieldType'];						
		sequelize.query("ALTER TABLE `"+tableName+"` CHANGE `"+oldFieldName+"` `"+newFieldName+"` "+fieldType+" NOT NULL").success(function(data) {
			sequelize.query("UPDATE TABLE `tb_flags` SET xFieldName='"+newFieldName+"' WHERE xFieldName='"+oldFieldName+"'; ").success(editAField_2).error(editAField_2);
			
			function editAField_2(){
				// GET ALL FIELDS IN THIS TABLE
				sequelize.query("DESCRIBE `"+tableName+"` ;").success(function(arrFields){							
					// UPDATE TABLE FLAG
					var fFilter=req.query['fFilter']; // "f" stands for "Flag" (boolean value)
					var fVisual=req.query['fVisual']; 
					var fResult=req.query['fResult'];
					var currentdate = new Date(); 
					var currentDatetime = currentdate.getFullYear()+ "-" + (currentdate.getMonth()+1)  + "-" + currentdate.getDate() + " "  + currentdate.getHours() + ":"  + currentdate.getMinutes() + ":" + currentdate.getSeconds();
					
					sequelize.query("SELECT * FROM `tb_flags` WHERE xTableName='"+tableName+"';").success(function(arrFlagRecords){	
						var flagExist=0;
						for (var i=0; i<arrFlagRecords.length; i++){
							flagRecord=arrFlagRecords[i];
							if (flagRecord['xFieldName']==newFieldName){ flagExist=1; break; }						
						}
		
						if (flagExist){
							sequelize.query("UPDATE `tb_flags` SET xIsFilter="+fFilter+", xIsVisual="+fVisual+", xIsResult="+fResult+", xUpdateTime='"+currentDatetime+"' WHERE xTableName='"+tableName+"' AND xFieldName='"+newFieldName+"';").success(function(data){
								res.send("Success");
							})	
						} else {
							sequelize.query("INSERT INTO `tb_flags` (xTableName, xFieldName, xIsFilter, xIsVisual, xIsResult, xUpdateTime) VALUES ('"+tableName+"', '"+newFieldName+"', "+fFilter+", "+fVisual+", "+fResult+", '"+currentDatetime+"');").success(function(data){								
								res.send("Success");
							})					
						}
						res.send("success");
					}).error(function(){
						// There is no flag for this table yet				
						sequelize.query("INSERT INTO `tb_flags` (xTableName, xFieldName, xIsFilter, xIsVisual, xIsResult, xUpdateTime) VALUES ('"+tableName+"', '"+newFieldName+"', "+fFilter+", "+fVisual+", "+fResult+", '"+currentDatetime+"');").success(function(data){								
							res.send("Success");
						})					
					});
				});
			}
			
		});
	} 
	else if(req.query["action"]=="removeAField"){			
		var tableName=req.query['tableName'];
		var oldFieldName=req.query['oldFieldName'];				
		sequelize.query("ALTER TABLE `"+tableName+"` DROP `"+oldFieldName+"`").success(function(data) {
			res.send("success");
		});
	} 
	else if(req.query["action"]=="addAField"){	
		var tableName=req.query['tableName'];
		var fieldName=req.query['fieldName'];
		var fieldType=req.query['fieldType'];
		fieldName=fieldName.replace(/['"]/g, "\"");
		sequelize.query("ALTER TABLE `"+tableName+"` ADD `"+fieldName+"` "+fieldType+" NOT NULL").success(function(data) {
			// UPDATE TABLE FLAG
			var fFilter=req.query['fFilter']; // "f" stands for "Flag" (boolean value)
			var fVisual=req.query['fVisual']; 
			var fResult=req.query['fResult'];
			var currentdate = new Date(); 
			var currentDatetime = currentdate.getFullYear()+ "-" + (currentdate.getMonth()+1)  + "-" + currentdate.getDate() + " "  + currentdate.getHours() + ":"  + currentdate.getMinutes() + ":" + currentdate.getSeconds();
			
			sequelize.query("INSERT INTO `tb_flags` (xTableName, xFieldName, xIsFilter, xIsVisual, xIsResult, xUpdateTime) VALUES ('"+tableName+"', '"+fieldName+"', "+fFilter+", "+fVisual+", "+fResult+", '"+currentDatetime+"');").success(function(data){								
				res.send("Success");
			})	
		});
	} 
	else if(req.query["action"]=="getTableStructure"){
		var tableName=req.query['tableName'];
		sequelize.query("DESCRIBE `"+tableName+"` ;").success(function(arr){
			console.log(arr);
			res.send(arr);
		});
	}
	else if(req.query["action"]=="getTableFlags"){
		var tableName=req.query['tableName'];
		sequelize.query("SELECT * FROM tb_flags WHERE xTableName='"+tableName+"' ;").success(function(arr){
			console.log(arr);
			res.send(arr);
		});
	}
	
	// =========================================================================================
	// ============================== TABLE DATA (RECORDS) ======================================
	
	else if(req.query["action"]=="getAllRecords"){	
		var tableName=req.query['tableName'];
		sequelize.query("SELECT * FROM `"+tableName+"`").success(function(allRecords) {
			//allRecords=convertIntegerToString(allRecords);
			res.send(allRecords);
		});
	}
	else if(req.query["action"]=="editARecord"){
		var tableName=req.query['tableName'];
		var id=req.query["id"];
		var sqlQuery="UPDATE `"+tableName+"` SET ";
		var count=0;
		for (var key in req.query){
			if (key=="action" || key=="id" || key=="tableName") continue;
			var val=req.query[key];
			val=val.replace(/['"]/g, "\"");
			if (count==0) 
				sqlQuery+=key+"='"+val+"'";
			else 
				sqlQuery+=","+key+"='"+val+"'";
			count++;
		}
		sqlQuery+=" WHERE id="+id;
		
		sequelize.query(sqlQuery).success(function(data) {
			res.send("success");
		});
	}
	else if(req.query["action"]=="removeARecord"){	
		var tableName=req.query['tableName'];
		var id=req.query['id'];
		sequelize.query("DELETE FROM `"+tableName+"` WHERE id="+id).success(function(data) {
			res.send("success");
		});
	} 
	else if(req.query["action"]=="addARecord"){		
		var tableName=req.query['tableName'];
		var sqlQuery="INSERT INTO `"+tableName+"` (`id`";		
		for (var key in req.query){			
			if (key=="action" || key=="id" || key=="tableName") continue;
			sqlQuery+=",`"+key+"`";
		}
		
		sqlQuery+=") VALUES ('', ";
		var count=0;
		for (var key in req.query){			
			if (key=="action" || key=="id" || key=="tableName") continue;
			var val=req.query[key];		
			val=val.replace(/['"]/g, "\"");
			if (count==0)
				sqlQuery+="'"+val+"'";
			else 
				sqlQuery+=",'"+val+"'";
			count++;
		}
		sqlQuery+=");";		
		
		sequelize.query(sqlQuery).success(function(data) {
			res.send("success");
		});
	} 		
};
