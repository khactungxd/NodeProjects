var tableStructureData;
var listJS;

$(function(){
	refreshData();
});

function refreshData(){	
	$('#loader').html('<img src="images/ajax-loader.gif" />');
	$('#tr-header').html("");		
	$('.list').html("<tr id='tr-item'></tr>");	
	showData();
}

function showData(){		
	$.get("ajax?action=getTableStructure", function(data){
		tableStructureData=data;
		
		// TR - HEADER & ITEMS
		var html_header="";
		var html_item="";
		var html_sort="";
		for (var attribute in data){			
			if (attribute=="id"){
				html_item+="<td class='id' style='display:none'></td>";
				continue;	// DONT SHOW "ID" FIELD ON #tr-header
			}			
			html_header+="<th >"+attribute+" ("+data[attribute].type+") <img src='images/sort.gif'  class='sort btn asc ' data-sort='"+attribute+"' /></th>";
			html_item+="<td class='"+attribute+"'></td>";
			html_sort+="<button class='sort btn asc' data-sort='"+attribute+"'>Sort by "+attribute+"</button>";
		}
		html_header+="<th>&nbsp;</th>";
		html_item+="<td><input type='button' class='btEdit' value='Edit'/><input type='button' class='btRemove' value='Remove'/></td>";
								
		// TR - ITEMS CONTENT
		$.get("ajax?action=getAllRecords", function(data){		
			data=convertIntegerToString(data);
			$('#tr-header').html(html_header);
			$('#tr-item').html(html_item);
			//$('#sort-by').html(html_sort);
			var options = {item: 'tr-item'};			
			listJS = new List('listJS', options, data);
			refreshEventHandlers();			
			$('#loader').html("");			
		});
	});		
}	
function showCloud(){
	$('#cloud-grey').css('display','block');
	$('#cloud-white').css('display','block');
}
function hideCloud(){
	$('#cloud-white').html("");
	$('#cloud-grey').css('display','none');
	$('#cloud-white').css('display','none');
}	
function refreshCloudEventHandlers(){
	$('#btCancel').click(function(){
		hideCloud();
	});
	$('.ip').click(function(){
		$(this).select();
	});
	$(document).keyup(function(e) {
		if (e.keyCode == 27) hideCloud();
	});
	$('.ipNumber').keydown(function(event) {
		// Allow: backspace, delete, tab, escape, and enter
		if ( event.keyCode == 46 || event.keyCode == 8 || event.keyCode == 9 || event.keyCode == 27 || event.keyCode == 13 || 
			 // Allow: Ctrl+A
			(event.keyCode == 65 && event.ctrlKey === true) || 
			 // Allow: home, end, left, right
			(event.keyCode >= 35 && event.keyCode <= 39)) {
				 // let it happen, don't do anything
				 return;
		}
		else {
			// Ensure that it is a number and stop the keypress
			if (event.shiftKey || (event.keyCode < 48 || event.keyCode > 57) && (event.keyCode < 96 || event.keyCode > 105 )) {
				event.preventDefault(); 
			}   
		}
	});
}
function refreshEventHandlers(){	
	$('#btRemoveFilter').click(function(){
		listJS.filter(); 
	});
	$('#btFilter').click(function(){
		listJS.filter(function(item) {
		   if (item.values().age > 18) {
			   return true;
		   } else {
			   return false;
		   }
		});
	});
	
	$('#btInsert').click(function(){
		showCloud();
		// TR - HEADER & ITEMS
		var html_header="";
		var html_item="";
		var firstFieldName="";
		for (var attribute in tableStructureData){			
			if (attribute=="id") continue;
			if (firstFieldName=="") firstFieldName=attribute;
			html_header+="<th>"+attribute+" ("+tableStructureData[attribute].type+")</th>";			
			if (tableStructureData[attribute].type=="INT(11)")
				html_item+="<td><input class='ip "+attribute+" ipNumber' value='' /></td>";
			else
				html_item+="<td><input class='ip "+attribute+"' value='' /></td>";
		}
		html_header+="<th>&nbsp;</th>";		
		html_item+="<td><input type='button' id='btInsertOnCloud' value='Insert'/><input type='button' id='btCancel' value='Cancel'/></td>";
		$('#cloud-white').html('<table style="width:100%"><tr>'+html_header+'</tr><tr>'+html_item+'</tr></table>');
		
		refreshCloudEventHandlers();
		$('.'+firstFieldName).select();
		$('.ip').keypress(function(e) {
			if(e.which == 13) {
				$('#btInsertOnCloud').click();
			}
		});	
		
		$('#btInsertOnCloud').click(function(){
			var ajaxQuery="ajax?action=addARecord";
			for (var attribute in tableStructureData){	
				if (attribute=="id") continue;
				var val=$('.'+attribute).val();				
				val=encodeURIComponent(val);
				ajaxQuery+="&"+attribute+"="+val;
			}
			$.get(ajaxQuery,function(data){
				hideCloud();
				refreshData();
			});
		});
	});
	$('.btEdit').click(function(){
		var itemId = $(this).closest('tr').find('.id').text();				
		showCloud();
		// TR - HEADER & ITEMS
		var html_header="";
		var html_item="";
		var firstFieldName="";
		for (var attribute in tableStructureData){			
			if (attribute=="id") continue;
			if (firstFieldName=="") firstFieldName=attribute;
			html_header+="<th>"+attribute+" ("+tableStructureData[attribute].type+")</th>";
			var fieldValue=$(this).closest('tr').find('.'+attribute).text();
			if (tableStructureData[attribute].type=="INT(11)")
				html_item+="<td><input class='ip "+attribute+" ipNumber' value='"+fieldValue+"' /></td>";
			else 
				html_item+="<td><input class='ip "+attribute+"' value='"+fieldValue+"' /></td>";
		}
		html_header+="<th>&nbsp;</th>";		
		html_item+="<td><input type='button' id='btEdit' value='Edit'/><input type='button' id='btCancel' value='Cancel'/></td>";
		$('#cloud-white').html('<table style="width:100%"><tr>'+html_header+'</tr><tr>'+html_item+'</tr></table>');
		
		refreshCloudEventHandlers();
		$('.'+firstFieldName).select();		
		$('.ip').keypress(function(e) {
			if(e.which == 13) {
				$('#btEdit').click();
			}			
		});				
		$('#btEdit').click(function(){
			var ajaxQuery="ajax?action=editARecord&id="+itemId+"";
			for (var attribute in tableStructureData){	
				if (attribute=="id") continue;
				var val=$('.'+attribute).val();
				val=encodeURIComponent(val);
				ajaxQuery+="&"+attribute+"="+val;
			}
			$.get(ajaxQuery,function(data){				
				hideCloud();
				refreshData();
			});
		});
	});
	
	$('.btRemove').click(function(){
		var itemId = $(this).closest('tr').find('.id').text();	
		$.get("ajax?action=removeARecord&id="+itemId, function(data){
			refreshData();
		});
	});	
}


// ======================= HELPER FUNCTIONS =====================
function convertIntegerToString(arr){
	for (var i=0;i<arr.length; i++){
		var item=arr[i];
		for (var k in item){				
			if (item.hasOwnProperty(k)){
				item[k] = String(item[k]);
			}
		}
	}			
	return arr;
}