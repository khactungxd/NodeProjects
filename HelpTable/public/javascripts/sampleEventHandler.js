$(function(){
	// Get table list;
	$('#mainTitle').click(function(){
		window.location="?";
	});
	$.get('ajax?action=getTableList', function(data){
		updateLeftColumn(data);

		// ========= Div Table (Manage Tables OR table name) ============
		if (tbl=="")
			$('#divTitle').html('Please select a table');
		else 
			$('#divTitle').html('Table "'+tbl+'"');
		
		afterLoadingTableList(data);
	});	
});

function afterLoadingTableList(data){
	if (!tbl) return;
	$('#divAutocompleteBox').html("<center>Loading...<br><br><img src='images/ajax-loader.gif' style='border:0px' /></center>");
	
	$.get('ajax?action=getAllRecords&tableName='+tbl, function(arrRecords){
		$.get('ajax?action=getTableFlags&tableName='+tbl, function(arrFlags){
			var html="Search: <input id='autocompleteBox' style='width:300px;'/>";
			$('#divAutocompleteBox').html(html);
			
			var autocompleteSource = [];
			for (var i=0; i<arrRecords.length;i++){
				var record=arrRecords[i];
				var filterValue=""; 
				var resultValue="";
				var resultTime=null;
				for (var fieldName in record){
					for (var j=0;j<arrFlags.length;j++){
						if (arrFlags[j]['xFieldName']==fieldName){
							if (arrFlags[j]['xIsFilter']==1) filterValue+=record[fieldName]+" ";
							if (arrFlags[j]['xIsResult']==1){
								if ( (resultTime==null) || (arrFlags[j]['xUpdateTime']>resultTime) ){
									resultValue=record[fieldName];
									resultTime=arrFlags[j]['xUpdateTime'];
								}
							}
						}
					}					
				}	
				autocompleteSource[autocompleteSource.length]={value: filterValue, result: resultValue};
			}
			$('#autocompleteBox').autocomplete({ 
				source: autocompleteSource,
				focus: function( event, ui ) {					
					//$('#autocompleteBox').val(ui.item.value);
					return false;
				  },
				select: function( event, ui ) {					
					$('#autocompleteBox').val(ui.item.result);
					return false;
				}
			});	
			$('#autocompleteBox').select();
		});
	});
}

function updateLeftColumn(data){
	var html="";
	for (var i=0; i<data.length; i++){
		if (data[i]=="tb_flags") continue;
		if (data[i]==tbl)
			html+='<li>'+data[i]+'</li>';
		else
			html+='<li><a href="?tbl='+data[i]+'">'+data[i]+'</a></li>';
	}		
	$('#tableList').html(html);
}