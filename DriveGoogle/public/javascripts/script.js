$(function() {
  
  var showInfo = function(message) {
    $('div.progress').hide();
    $('strong.message').text(message);
    $('div.alert').show();
  };
  
  $('input[type="submit"]').on('click', function(evt) {
    evt.preventDefault();
    $('div.progress').show();
    var formData = new FormData();
    var file = document.getElementById('myFile').files[0];
    formData.append('myFile', file);
    
    var xhr = new XMLHttpRequest();
    
    xhr.open('post', 'http://192.168.10.236:3400/upload', true);
//    xhr.open('post', '/upload', true);

    xhr.upload.onprogress = function(e) {
      if (e.lengthComputable) {
        var percentage = (e.loaded / e.total) * 100;
        $('div.progress div.bar').css('width', percentage + '%');
      }
    };
    
    xhr.onerror = function(e) {
      console.log(e)
      showInfo('An error occurred while submitting the form. Maybe your file is too big');
    };
    
    xhr.onload = function() {
      var result = JSON.parse(this.responseText);
      if(!result["success"]){
        showInfo('Error connect to Driver wait 3 second for redirect');
        setTimeout(function(){
          location.href = result["redirect"];
        },3000);
      } else {
        showInfo("File "+result["filename"]+" upload to Drive success...!");
        $.get('http://192.168.10.236:3400/get/drive/list', function (procedures, status, params) {
          $(".item-drive").html(procedures);
        })
      }
    };
    
    xhr.send(formData);
    
  });
  
});