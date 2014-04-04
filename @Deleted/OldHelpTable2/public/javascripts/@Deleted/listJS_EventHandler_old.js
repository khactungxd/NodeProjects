$(document).ready(function(){
var idField = $('#id-field'),
		nameField = $('#name-field'),
		ageField = $('#age-field'),
		cityField = $('#city-field'),
		addBtn = $('#add-btn'),
		editBtn = $('#edit-btn').hide();
		
	showData();
	
	addBtn.click(function() {
		$.ajax({
			url: "/ajax?action=addARecord&name="+nameField.val()+"&age="+ageField.val()+"&city="+cityField.val(),
			cache:false,
			success:function(){
				showData();
				clearFields();
			}
		});
	});
	editBtn.click(function() {
	   $.ajax({
			url: "/ajax?action=edit&id="+idField.val()+"&name="+nameField.val()+"&age="+ageField.val()+"&city="+cityField.val(),
			cache:false,
			success:function(){
				clearFields();
				editBtn.hide();
				addBtn.show();
				showData();
			}
		});
	});

	
	
	function refreshEventHandlers(){
		var removeBtns = $('.remove-item-btn'),
			  editBtns = $('.edit-item-btn');
		
		removeBtns.click(function() {
		   var itemId = $(this).closest('tr').find('.id').text();			
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
	
	}
    function showData(){
		$.get("/ajax?action=getAllRecords", function(data){			
			var options = {
				item: 'tr-item'
			};
			var listJS = new List('listJS', options, data);
			refreshEventHandlers();					
		});
	}

	 function clearFields() {
           nameField.val('');
           ageField.val('');
           cityField.val('');
     }
})