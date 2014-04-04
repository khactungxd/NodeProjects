function afterLoadingTableList(data){
	reloadPageWithData(data);
}

function refreshEventHandlers(){
	$('.ipTableName').click(function(){
		$(this).select();
	});
	$('.btRename').click(function(){		
		var index=$(this).attr('index');
		var oldTableName=$('.ipOldTableName[index='+index+']').val();
		var newTableName=$('.ipTableName[index='+index+']').val();
		if (newTableName==oldTableName) return;
		var ajaxQuery="ajax?action=renameTable&oldTableName="+oldTableName+"&newTableName="+newTableName;
		$('#data').html("<tr><td><img src='images/ajax-loader.gif' style='border:0px' /></td></tr>");
		$.get(ajaxQuery,function(data){			
			reloadPage();
		});
	});
	$('.btRemove').click(function(){				
		var index=$(this).attr('index');
		var tableName=$('.ipOldTableName[index='+index+']').val();
		var ajaxQuery="ajax?action=removeTable&tableName="+tableName;		
		$('#data').html("<tr><td><img src='images/ajax-loader.gif' style='border:0px' /></td></tr>");		
		$.get(ajaxQuery,function(data){			
			reloadPage();
		});
	});
	$('#btAdd').click(function(){		
		// Validation
		var duplicatedName=0;
		$('.ipOldTableName').each(function(index){
			if ( $('#ipTableName').val()==$(this).val() ) duplicatedName=1;
		});
		if (duplicatedName){
			alert('This table name is already existed !');
		} else {					
			var ajaxQuery="ajax?action=addTable&tableName="+$('#ipTableName').val();		
			$('#data').html("<tr><td><img src='images/ajax-loader.gif' style='border:0px' /></td></tr>");		
			$.get(ajaxQuery,function(data){			
				reloadPage();
			});
		}
	});
	$('.btEdit').click(function(){
		var index=$(this).attr('index');
		var tableName=$('.ipOldTableName[index='+index+']').val();
		window.location='?tbl='+tableName+'&page=structure';
	});
}

function reloadPageWithData(data){
	// <TR> - HEADER
	var html="<tr><th>Table Name</th><th>&nbsp;</th></tr>";
	
	// <TR>'s - EXISTED FIELDS
	var index=0;
	for (var i=0; i<data.length; i++){
		if (data[i]=="tb_flag") continue;
		html+="<tr>";
		html+="<td><input value='"+data[i]+"' type='Hidden' class='ipOldTableName' index='"+index+"'/><input value='"+data[i]+"' class='ipTableName centered' index='"+index+"'/></td>";			
		html+="<td><input type='button' class='btRename' value='Rename' index='"+index+"' /><input index='"+index+"' class='btEdit' type='button' value='Edit' /><input index='"+index+"' class='btRemove' type='button' value='Remove' /></td>";
		html+="</tr>";						
		index++;
	}
	
	// <TR> - ADD NEW FIELD
	html+="<tr><td><input id='ipTableName' class='centered bgGreen' /></td>";	
	html+="<td><input type='button' id='btAdd' value='Add' /></td></tr>";
		
	$('#data').html(html);
	refreshEventHandlers();
}
function reloadPage(){	
	$.get("ajax?action=getTableList",function(data){	
		updateLeftColumn(data);
		reloadPageWithData(data);
	});
}

