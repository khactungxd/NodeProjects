$(function(){
	// Get table list;
	$('#mainTitle').click(function(){
		window.location="?";
	});
	$.get('ajax?action=getTableList', function(data){
		updateLeftColumn(data);

		// ========= Div Table (Manage Tables OR table name) ============
		if (currentPage=="tableList")
			$('#divTitle').html('Manage Tables');
		else 
			$('#divTitle').html('Table "'+tbl+'"');
		
		afterLoadingTableList(data);
	});	
});

function updateLeftColumn(data){
	if (currentPage=="tableList")
		$('#divManageTables').html("Manage Tables");
	else 
		$('#divManageTables').html("<a href='?page=tableList'>Manage Tables</a>");		
	
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