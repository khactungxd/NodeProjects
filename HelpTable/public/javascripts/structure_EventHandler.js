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
		// Calculate Flag
		var fFilter=0;
		if ($('.cbFilter[index='+index+']').is(':checked')) fFilter=1;
		var fVisual=0;
		if ($('.cbVisual[index='+index+']').is(':checked')) fVisual=1;
		var fResult=0;
		if ($('.radioResult[index='+index+']').is(':checked')) fResult=1;		
		
		var ajaxQuery="ajax?tableName="+tbl+"&action=editAField&fFilter="+fFilter+"&fVisual="+fVisual+"&fResult="+fResult+"&oldFieldName="+oldFieldName+"&fieldName="+fieldName+"&fieldType="+fieldType+"";
		$('#data').html("<tr><td><img src='images/ajax-loader.gif' style='border:0px' /></td></tr>");
		$.get(ajaxQuery,function(data){			
			//alert("Result = "+data);
			reloadPage();
		});
	});
	$('.btRemove').click(function(){		
		if (confirm("Are you sure to remove this field ?")){
			var index=$(this).attr('index');
			var oldFieldName=encodeURIComponent($('.ipOldFieldName[index='+index+']').val());
			var ajaxQuery="ajax?tableName="+tbl+"&action=removeAField&oldFieldName="+oldFieldName;		
			$('#data').html("<tr><td><img src='images/ajax-loader.gif' style='border:0px' /></td></tr>");		
			$.get(ajaxQuery,function(data){			
				reloadPage();
			});
		}
	});
	$('#btAdd').click(function(){		
		// Validation
		if ($('#ipFieldName').val()=="") {alert("Please enter field name first !"); return;}
		var duplicatedName=0;
		$('.ipOldFieldName').each(function(index){
			if ( $('#ipFieldName').val()==$(this).val() ) duplicatedName=1;
		});
		if (duplicatedName){
			alert('This field is already existed !');
		} else {		
			// Calculate Flag
			var fFilter=0;
			if ($('#cbFilter').is(':checked')) fFilter=1;
			var fVisual=0;
			if ($('#cbVisual').is(':checked')) fVisual=1;
			var fResult=0;
			if ($('#radioResult').is(':checked')) fResult=1;		
		
			var fieldName=encodeURIComponent($('#ipFieldName').val());
			var fieldType=$('#slFieldType').val();
			var ajaxQuery="ajax?tableName="+tbl+"&fFilter="+fFilter+"&fVisual="+fVisual+"&fResult="+fResult+"&action=addAField&fieldName="+fieldName+"&fieldType="+fieldType;		
			$('#data').html("<tr><td><img src='images/ajax-loader.gif' style='border:0px' /></td></tr>");		
			$.get(ajaxQuery,function(data){			
				reloadPage();
			});
		}
	});
}
function reloadPage(){
	$.get("ajax?tableName="+tbl+"&action=getTableStructure",function(data){
		$.get("ajax?tableName="+tbl+"&action=getTableFlags",function(arrFlags){
			
			// <TR> - HEADER
			var html="<tr><th>Field Name</th><th>Type</th><th>Visual</th><th>Filter</th><th>Result</th><th>&nbsp;</th></tr>";
			
			// <TR>'s - EXISTED FIELDS
			var index=0;
			for (var attribute in data){
				// DONT ALLOW TO EDIT "ID" FIELD (this field is AUTO_INCREMENT and FIXED)
				if (attribute=="id") continue;
				
				// Get all flag values
				var addedStringFilter="";
				var addedStringVisual="checked";
				var addedStringResult="";
				for (var k=0; k<arrFlags.length; k++){
					if (attribute == arrFlags[k]['xFieldName']){
						if (arrFlags[k]['xIsFilter']==1) addedStringFilter="checked";
						if (arrFlags[k]['xIsVisual']==0) addedStringVisual="";
						if (arrFlags[k]['xIsResult']==1){
							addedStringResult="checked";
							var thisUpdateTime=arrFlags[k]['xUpdateTime'];
							for (var k1=0; k1<arrFlags.length; k1++){
								if ( (arrFlags[k1]['xUpdateTime']>thisUpdateTime) && (arrFlags[k1]['xIsResult']==1) ) addedStringResult="";
							}
						}
					}
				}
				
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
				// VISUAL ?
				html+="<td><input type='checkbox' class='cbVisual'  "+addedStringVisual+" index='"+index+"' /></td>"; 
				// FILTER ?				
				html+="<td><input type='checkbox' class='cbFilter' "+addedStringFilter+" index='"+index+"'  /></td>"; 				
				// RESULT ?
				html+="<td><input type='radio' name='radioResult'   "+addedStringResult+" class='radioResult' index='"+index+"'  /></td>"; 
				
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
			// VISUAL ?
			html+="<td><input type='checkbox' id='cbVisual' checked/></td>"; 
			// FILTER ?
			html+="<td><input type='checkbox' id='cbFilter' /></td>"; 			
			// RESULT ?
			html+="<td><input type='radio'  name='radioResult' id='radioResult' /></td>"; 
			
			html+="<td><input type='button' id='btAdd' value='Add' /></td></tr>";
			
			$('#data').html(html);
			refreshEventHandlers();
		});
	});
}

