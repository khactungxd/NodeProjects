var arrFieldTypes=["TEXT", "INT(11)"];

$(function(){		
	reloadPage();
});

function refreshEventHandlers(){
	$('.btUpdate').click(function(){
		var index=$(this).attr('index');
		var oldFieldName=encodeURIComponent($('.ipOldFieldName[index='+index+']').val());		
		var fieldName=encodeURIComponent($('.ipFieldName[index='+index+']').val());		
		var fieldType=$('.slFieldType[index='+index+']').val();
		var ajaxQuery="ajax?action=editAField&oldFieldName="+oldFieldName+"&fieldName="+fieldName+"&fieldType="+fieldType+"";
		$('#data').html("<tr><td><img src='images/ajax-loader.gif' style='border:0px' /></td></tr>");
		$.get(ajaxQuery,function(data){			
			reloadPage();
		});
	});
	$('.btRemove').click(function(){		
		var index=$(this).attr('index');
		var oldFieldName=encodeURIComponent($('.ipOldFieldName[index='+index+']').val());
		var ajaxQuery="ajax?action=removeAField&oldFieldName="+oldFieldName;		
		$('#data').html("<tr><td><img src='images/ajax-loader.gif' style='border:0px' /></td></tr>");		
		$.get(ajaxQuery,function(data){			
			reloadPage();
		});
	});
	$('#btAdd').click(function(){		
		// Validation
		var duplicatedName=0;
		$('.ipOldFieldName').each(function(index){
			if ( $('#ipFieldName').val()==$(this).val() ) duplicatedName=1;
		});
		if (duplicatedName){
			alert('This field is already existed !');
		} else {		
			var fieldName=encodeURIComponent($('#ipFieldName').val());
			var fieldType=$('#slFieldType').val();
			var ajaxQuery="ajax?action=addAField&fieldName="+fieldName+"&fieldType="+fieldType;		
			$('#data').html("<tr><td><img src='images/ajax-loader.gif' style='border:0px' /></td></tr>");		
			$.get(ajaxQuery,function(data){			
				reloadPage();
			});
		}
	});
}
function reloadPage(){
	$.get("ajax?action=getTableStructure",function(data){			
		// <TR> - HEADER
		var html="<tr><th>Field Name</th><th>Type</th><th>Filter</th><th>Visual</th><th>Result</th><th>&nbsp;</th></tr>";
		
		// <TR>'s - EXISTED FIELDS
		var index=0;
		for (var attribute in data){
			// DONT ALLOW TO EDIT "ID" FIELD (this field is AUTO_INCREMENT and FIXED)
			if (attribute=="id") continue;
			
			html+="<tr>";
			html+="<td><input value='"+attribute+"' type='hidden' class='ipOldFieldName' index='"+index+"' /><input value='"+attribute+"' class='ipFieldName' index='"+index+"' /></td>";
			html+="<td><select index='"+index+"'  class='slFieldType'>";
			for (var i=0; i<arrFieldTypes.length; i++){				
				if (data[attribute].type==arrFieldTypes[i])
					html+="<option value='"+arrFieldTypes[i]+"' selected>"+arrFieldTypes[i]+"</option>";
				else
					html+="<option value='"+arrFieldTypes[i]+"'>"+arrFieldTypes[i]+"</option>";				
			}
			html+="</select></td>";
			// FILTER ?
			html+="<td><input type='checkbox' /></td>"; 
			// VISUAL ?
			html+="<td><input type='checkbox' /></td>"; 
			// RESULT ?
			html+="<td><input type='radio' name='radioResult' /></td>"; 
			
			html+="<td><input type='button' class='btUpdate' value='Update'  index='"+index+"'/><input class='btRemove'  index='"+index+"' type='button' value='Remove' /></td>";
			html+="</tr>";						
			index++;
		}
		
		// <TR> - ADD NEW FIELD
		html+="<tr><td><input id='ipFieldName' class='bgGreen' /></td><td><select id='slFieldType' class='bgGreen' >";
		for (var i=0; i<arrFieldTypes.length; i++){							
			html+="<option value='"+arrFieldTypes[i]+"'>"+arrFieldTypes[i]+"</option>";				
		}
		html+="</select></td>";
		// FILTER ?
		html+="<td><input type='checkbox' /></td>"; 
		// VISUAL ?
		html+="<td><input type='checkbox' /></td>"; 
		// RESULT ?
		html+="<td><input type='radio'  name='radioResult' /></td>"; 
		
		html+="<td><input type='button' id='btAdd' value='Add' /></td></tr>";
		
		$('#data').html(html);
		refreshEventHandlers();
	});
}

