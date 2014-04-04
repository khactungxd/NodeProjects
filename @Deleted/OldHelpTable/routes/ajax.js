var Sequelize = require("sequelize");
var TABLE_NAME="tb_data";
var sequelize = new Sequelize('helptable2', 'root', 'blank');

exports.index = function(req, res){  	
	
	// =========================================================================================
	// ===================== TABLE STRUCTURE (ADD/REMOVE/UPDATE FIELDS) ========================
	
	if(req.query["action"]=="editAField"){		
		var oldFieldName=req.query['oldFieldName'];
		var newFieldName=req.query['fieldName'];
		var fieldType=req.query['fieldType'];		
		sequelize.query("ALTER TABLE `"+TABLE_NAME+"` CHANGE `"+oldFieldName+"` `"+newFieldName+"` "+fieldType+" NOT NULL").success(function(data) {
			res.send("success");
		});
	} 
	else if(req.query["action"]=="removeAField"){				
		var oldFieldName=req.query['oldFieldName'];				
		sequelize.query("ALTER TABLE `"+TABLE_NAME+"` DROP `"+oldFieldName+"`").success(function(data) {
			res.send("success");
		});
	} 
	else if(req.query["action"]=="addAField"){				
		var fieldName=req.query['fieldName'];
		var fieldType=req.query['fieldType'];
		sequelize.query("ALTER TABLE `"+TABLE_NAME+"` ADD `"+fieldName+"` "+fieldType+" NOT NULL").success(function(data) {
			res.send("success");
		});
	} 
	else if(req.query["action"]=="getTableStructure"){
		sequelize.query("DESCRIBE "+TABLE_NAME).success(function(arr){
			res.send(arr);
		});
	}
	
	// =========================================================================================
	// ============================== TABLE DATA (RECORDS) ======================================
	
	else if(req.query["action"]=="getAllRecords"){		
		sequelize.query("SELECT * FROM "+TABLE_NAME).success(function(myTableRows) {
			res.send(myTableRows);
		});
	}
	else if(req.query["action"]=="editARecord"){
		var id=req.query["id"];
		var sqlQuery="UPDATE `"+TABLE_NAME+"` SET ";
		var count=0;
		for (var key in req.query){
			if (key=="action" || key=="id") continue;
			var val=req.query[key];
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
		var id=req.query['id'];
		sequelize.query("DELETE FROM `"+TABLE_NAME+"` WHERE id="+id).success(function(data) {
			res.send("success");
		});
	} 
	else if(req.query["action"]=="addARecord"){				
		var id=req.query["id"];
		var sqlQuery="INSERT INTO `helptable`.`"+TABLE_NAME+"` VALUES ('', ";
		var count=0;
		for (var key in req.query){
			if (key=="action" || key=="id") continue;
			var val=req.query[key];			
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
	/*
	if(req.query["action"]==undefined){
		console.log(req.query["name"]);
		sequelize.query("SELECT * FROM tb_sequelizejs").success(function(myTableRows) {
			res.send(myTableRows);
		});
	}else if(req.query["action"]=="insert"){
		var name =req.query["name"];
		var age =req.query["age"] ;
		var city = req.query["city"];
		console.log(name);
		sequelize.query("INSERT INTO tb_sequelizejs(name,age,city) VALUES ('"+name+"',"+age+",'"+city+"')").success(
			function() {
				sequelize.query("SELECT * FROM tb_sequelizejs").success(function(myTableRows) {
				res.send(myTableRows);
			});
		});
	}else if(req.query["action"]=="delete"){
		sequelize.query("DELETE FROM tb_sequelizejs WHERE id='"+req.query["id"]+"'").success(
			function() {
				sequelize.query("SELECT * FROM tb_sequelizejs").success(function(myTableRows) {
				res.send(myTableRows);
			});
		});
	}else if(req.query["action"]=="edit"){
		sequelize.query("UPDATE  tb_sequelizejs SET name='"+req.query["name"]+"',age='"+req.query["age"]+"', city='"+req.query["city"]+"' WHERE id='"+req.query["id"]+"'").success(
			function() {
				sequelize.query("SELECT * FROM tb_sequelizejs").success(function(myTableRows) {
				res.send(myTableRows);
			});
		});
	}else if(req.query["action"]=="autoCompleteName"){
		sequelize.query("SELECT name FROM tb_sequelizejs").success(function(myTableRows) {
			res.send(myTableRows);
		});
	}else if(req.query["action"]=="autoCompleteAge"){
		sequelize.query("SELECT age FROM tb_sequelizejs").success(function(myTableRows) {
			res.send(myTableRows);
		});
	}else if(req.query["action"]=="autoCompleteCity"){
		sequelize.query("SELECT city FROM tb_sequelizejs").success(function(myTableRows) {
			res.send(myTableRows);
		});
	} else if(req.query["action"]=="getTableStructure"){
		sequelize.query("DESCRIBE tb_sequelizejs").success(function(arr) {
			res.send(arr);
		});
	}
	*/
	
};

