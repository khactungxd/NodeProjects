$(document).ready(function(){		
	var idField = $('#id-field'),
		nameField = $('#name-field'),
		ageField = $('#age-field'),
		cityField = $('#city-field');
	getDataSource("autoCompleteName", "name", nameField);
	//getDataSource("autoCompleteAge", "age", ageField);
	getDataSource("autoCompleteCity", "city", cityField);
	
});

function getDataSource(action,property,element){
	var arrData = new Array();
	$.get("ajax?action="+action,function(data){		
		for(var i=0;i<data.length;i++){
			arrData[arrData.length] = data[i][property];
		}
		$(element).autocomplete({
			source: arrData
		});
	});	
}

