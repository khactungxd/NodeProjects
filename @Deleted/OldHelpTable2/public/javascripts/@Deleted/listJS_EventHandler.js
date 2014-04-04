var tableStructureData;

$(function(){
	refreshData();
});

function refreshData(){	
	$('#tr-header').html("");		
	$('.list').html("<tr id='tr-item'></tr>");
	showData();
}
function showData(){		
	$.get("/ajax?action=getTableStructure", function(data){
		tableStructureData=data;
		
		// TR - HEADER & ITEMS
		var html_header="";
		var html_item="";
		for (var attribute in data){			
			if (attribute=="id"){
				html_item+="<td class='id' style='display:none'></td>";
				continue;	// DONT SHOW "ID" FIELD ON #tr-header
			}
			html_header+="<th>"+attribute+" ("+data[attribute].type+")</th>";
			html_item+="<td class='"+attribute+"'></td>";
		}
		html_header+="<th>&nbsp;</th>";
		$('#tr-header').html(html_header);
		html_item+="<td><input type='button' class='btEdit' value='Edit'/><input type='button' class='btRemove' value='Remove'/></td>";
		$('#tr-item').html(html_item);
								
		// TR - ITEMS CONTENT
		$.get("/ajax?action=getAllRecords", function(data){			
			var options = {item: 'tr-item'};
			var listJS = new List('listJS', options, data);
			refreshEventHandlers();					
		});
	});		
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
}
function refreshEventHandlers(){
	$('.btEdit').click(function(){
		var itemId = $(this).closest('tr').find('.id').text();
		
		$('#cloud-grey').css('display','block');
		$('#cloud-white').css('display','block');
		
		// TR - HEADER & ITEMS
		var html_header="";
		var html_item="";
		var firstFieldName="";
		for (var attribute in tableStructureData){			
			if (attribute=="id") continue;
			if (firstFieldName=="") firstFieldName=attribute;
			html_header+="<th>"+attribute+" ("+tableStructureData[attribute].type+")</th>";
			var fieldValue=$(this).closest('tr').find('.'+attribute).text();
			html_item+="<td><input class='ip "+attribute+"' value='"+fieldValue+"' /></td>";
		}
		html_header+="<th>&nbsp;</th>";		
		html_item+="<td><input type='button' id='btEdit' value='Edit'/><input type='button' id='btCancel' value='Cancel'/></td>";
		$('#cloud-white').html('<table style="width:100%"><tr>'+html_header+'</tr><tr>'+html_item+'</tr></table>');
		
		refreshCloudEventHandlers();
		$('.'+firstFieldName).select();
		/*
		$(document).keypress(function(e) {
			if(e.which == 13) {
				alert('You pressed enter!');
			}	
		});
		*/
		$('#btEdit').click(function(){
			var ajaxQuery="/ajax?action=editARecord&id="+itemId+"";
			for (var attribute in tableStructureData){	
				if (attribute=="id") continue;
				ajaxQuery+="&"+attribute+"="+$('.'+attribute).val();
			}
			$.get(ajaxQuery,function(data){				
				hideCloud();
				refreshData();
			});
		});
	});
	/*
	removeBtns.click(function() {
	   
		$.ajax({
			url: "/ajax?action=delete&id="+itemId,
			cache:false,
			success:function(){
				showData();
			}
		});			
	});	

	 editBtns.click(function() {
		editBtn.show();
		addBtn.hide();
		idField.val($(this).closest('tr').find('.id').text());
		nameField.val($(this).closest('tr').find('.name').text());
		ageField.val($(this).closest('tr').find('.age').text());
		cityField.val($(this).closest('tr').find('.city').text());
	 });
	*/
}