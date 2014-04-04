var arrFieldNames=new Array();

$(function(){		
	reloadPage();
});

function refreshEventHandlers(){
	$('.btUpdate').click(function(){
		var index=$(this).attr('index');
		var recordID=$('.ipRecordID[index='+index+']').val();		
		var ajaxQuery="ajax?action=editARecord&id="+recordID;
		for (var j=0; j<arrFieldNames.length; j++){
			ajaxQuery+="&"+arrFieldNames[j]+"="+$('.ipRecordField[index='+index+'][field='+arrFieldNames[j]+']').val();
		}
		//alert(ajaxQuery); return;
		$('#data').html("<tr><td><img src='/images/ajax-loader.gif' style='border:0px' /></td></tr>");
		$.get(ajaxQuery,function(data){			
			reloadPage();
		});
	});
	$('.btRemove').click(function(){		
		var index=$(this).attr('index');
		var recordID=$('.ipRecordID[index='+index+']').val();		
		var ajaxQuery="ajax?action=removeARecord&id="+recordID;		
		$('#data').html("<tr><td><img src='/images/ajax-loader.gif' style='border:0px' /></td></tr>");		
		$.get(ajaxQuery,function(data){			
			reloadPage();
		});
	});
	$('#btAdd').click(function(){
		var ajaxQuery="ajax?action=addARecord";		
		for (var j=0; j<arrFieldNames.length; j++){
			ajaxQuery+="&"+arrFieldNames[j]+"="+$('.ipRecordField[index=new][field='+arrFieldNames[j]+']').val();
		}
		$('#data').html("<tr><td><img src='/images/ajax-loader.gif' style='border:0px' /></td></tr>");				
		$.get(ajaxQuery,function(data){			
			reloadPage();
		});		
	});
}
function reloadPage(){
	arrFieldNames=new Array();
	$.get("ajax?action=getTableStructure",function(data){			
		// <TR> - HEADER
		var html="<tr>";						
		for (var attribute in data){			
			if (attribute=="id") continue;	// DONT SHOW "ID" FIELD		
			html+="<th>"+attribute+" ("+data[attribute].type+")</th>";
			arrFieldNames[arrFieldNames.length]=attribute;
		}
		html+="<th>&nbsp;</th></tr>";
		
		$.get("ajax?action=getAllRecords", function(arr){
			var index=0;			
			
			// <TR>'s - RECORDS
			for (var i=0; i<arr.length; i++){
				var record=arr[i];
				html+="<tr>";
				html+="<input type='hidden' class='ipRecordID' value='"+record['id']+"' index='"+index+"' />";
				
				for (var attribute in record){
					if (attribute=="id") continue;	 // DONT SHOW "ID" FIELD		
					html+="<td><input value='"+record[attribute]+"' class='ipRecordField' field='"+attribute+"'  index='"+index+"'  /></td>";
				}
				html+="<td><input type='button' class='btUpdate' value='Update'  index='"+index+"'/><input class='btRemove'  index='"+index+"' type='button' value='Remove' /></td>";
				html+="</tr>";
				index++;
			}
			
			// <TR> - ADD NEW RECORD
			html+="<tr>";
			for (var attribute in record){
				if (attribute=="id") continue;	 // DONT SHOW "ID" FIELD
				html+="<td><input value='' class='ipRecordField bgGreen' field='"+attribute+"' index='new' /></td>";
			}
			html+="<td><input type='button' id='btAdd' value='Add' /></td>";
			html+="</tr>";
		
			$('#data').html(html);
			refreshEventHandlers();
		});		
	});
}
