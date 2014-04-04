$(document).ready(function () {
  $("#db2Schema").change(function () {
    var db2Schema = $("#db2Schema option:selected").val();
    $("#select-proc").html(null);
    if (db2Schema != "default") {
      $.get('/procedures/' + db2Schema, function (procedures, status, params) {
//        $("#select-proc").html('<select id="db2Procedures">');
        $("#select-proc").html(procedures);
      })
    }
  });
  $("#run_procedures").click(function () {
    $('#dynamic').html(null);
    var db2Schema = $("#db2Schema option:selected").val();
    var db2ProcedureSpecific = $("#db2Procedures option:selected").val();
    var db2ProcedureName = $("#db2Procedures option:selected").text();
    if (!db2Schema || db2Schema == "default")
      apprise("schema can not found !");
    else if (!db2ProcedureSpecific || db2ProcedureSpecific == "default")
      apprise("procedures can not found !")
    else {
      console.log("Are you ready !")
      var data = {
        "schema" : db2Schema,
        "procedure_name" : db2ProcedureName,
        "specific_name" : db2ProcedureSpecific
      }
      $.ajax({
        type: "POST",
        url: "/procedures/run",
        data: data,
        success: function(data, textStatus, jqXHR){
          if(data["rows"] && data["rows"].length > 0){
            $('#dynamic').html( '<table cellpadding="0" cellspacing="0" border="0" class="display" id="result_procedure"></table>' );
            var aDataSet = data["rows"];
            var aoColumns = [];
            for(var key in aDataSet[0]){
              aoColumns.push({"mData": key.toString(),"sTitle":key.toString(),"sClass": "center"});
            }
            $('#result_procedure').dataTable( {
              "aaData": aDataSet,
              "aoColumns": aoColumns
            });
          } else {
            $("#dialog-form").html(data);
            $("#dialog-form").dialog("open");
          }
        }
      });
    }
  });
  $( "#dialog-form" ).dialog({
    autoOpen: false,
    height: 300,
    width: 350,
    modal: true,
    buttons: {
      "OK": function() {
        var data = {
          "schema" : $('form .schema').val(),
          "procedure_name" : $('form .proc-name').val(),
          "specific_name" : $('form .specific-name').val(),
          "params" : {}
        }
        var arrInput = $('form .param-proc');
        for(var i=0;i<arrInput.length;i++){
          data.params[arrInput[i].attributes["ordinal"].value] = arrInput[i].value.toString();
        }
        $.ajax({
          type: "POST",
          url: "/procedures/run",
          data: data,
          success: function(data, textStatus, jqXHR){
            if(data["rows"] && data["rows"].length > 0){
              $('#dynamic').html( '<table cellpadding="0" cellspacing="0" border="0" class="display" id="result_procedure"></table>' );
              var aDataSet = data["rows"];
              var aoColumns = [];
              var colNumber = 0;
              for(var key in aDataSet[0]){
                aoColumns[colNumber] = {"sTitle": key,"mData":key,"sClass": "center"};
                colNumber ++;
              }
              $('#result_procedure').dataTable( {
                "aaData": aDataSet,
                "aoColumns": aoColumns
              });
            } else {
              $('#result_procedure').html(null);
            }
          }
        });
        $( this ).dialog( "close" );
      },
      Cancel: function() {
        $( this ).dialog( "close" );
      }
    },
    close: function() {
     // $( this ).dialog( "close" );
    }
  });
})