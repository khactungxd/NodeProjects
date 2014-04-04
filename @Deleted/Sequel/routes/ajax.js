var Sequelize = require("sequelize");

var sequelize = new Sequelize('test', 'root', 'blank');
exports.index = function(req, res){  	

	if(req.query["action"]==undefined){
		console.log(req.query["name"]);
		sequelize.query("SELECT * FROM mytable").success(function(myTableRows) {
			res.send(myTableRows);
		});
	}else if(req.query["action"]=="insert"){
		var name =req.query["name"];
		var age =req.query["age"] ;
		var city = req.query["city"];
		console.log(name);
		sequelize.query("INSERT INTO mytable(name,age,city) VALUES ("+"'"+name+"','"+age+"','"+city+"')").success(
			function() {
				sequelize.query("SELECT * FROM mytable").success(function(myTableRows) {
				res.send(myTableRows);
			});
		});
	}else if(req.query["action"]=="delete"){
		sequelize.query("DELETE FROM mytable WHERE id='"+req.query["id"]+"'").success(
			function() {
				sequelize.query("SELECT * FROM mytable").success(function(myTableRows) {
				res.send(myTableRows);
			});
		});
	}else if(req.query["action"]=="edit"){
		sequelize.query("UPDATE  mytable SET name='"+req.query["name"]+"',age='"+req.query["age"]+"', city='"+req.query["city"]+"' WHERE id='"+req.query["id"]+"'").success(
			function() {
				sequelize.query("SELECT * FROM mytable").success(function(myTableRows) {
				res.send(myTableRows);
			});
		});
	}else if(req.query["action"]=="autoCompleteName"){
		sequelize.query("SELECT name FROM mytable").success(function(myTableRows) {
			res.send(myTableRows);
		});
	}else if(req.query["action"]=="autoCompleteAge"){
		sequelize.query("SELECT age FROM mytable").success(function(myTableRows) {
			res.send(myTableRows);
		});
	}else if(req.query["action"]=="autoCompleteCity"){
		sequelize.query("SELECT city FROM mytable").success(function(myTableRows) {
			res.send(myTableRows);
		});
	}
	
};

