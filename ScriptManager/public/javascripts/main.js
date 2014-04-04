var oTable;
$(document).ready(function () {
  var socket = io.connect('http://192.168.10.236:3200');
//  var socket = io.connect('http://localhost:3200');

  socket.on('connected', function (data) {

    // create table list
    socket.emit('register.event.list.node');
    socket.on('pipe.list.node', processTable);
    socket.on('end.viewlog.nodes', function(log){
      $("#lognode-dialog code").text(log.log);
      $("span.ui-dialog-title").text(log.node["NAME"]);
      $("#lognode-dialog").dialog("open").css("visibility", "visible");
    });

    //event click add new
    $("#add-service").click(function (event) {
      $("#dialog-form").dialog("open").css("visibility", "visible");
    });

    $("#lognode-dialog").dialog({
      autoOpen: false,
      height: 300,
      width: 900,
      modal: true,
      buttons: {
        "OK": function () {
          $(this).dialog("close");
        }
      },
      close: function () {
        $( this ).dialog( "close" );
      }
    });

    $("#dialog-form").dialog({
      autoOpen: false,
      height: 300,
      width: 500,
      modal: true,
      buttons: {
        "OK": function () {
          var prjName = $("#prj-name").val();
          var pid = $("#prj-pid").val();
          var prjDir = $("#path-for-prj").val();
          var prjPort = $("#prj-port").val();
          var oNode = {
            "PID":pid,
            "NAME":prjName,
            "DIR":prjDir,
            "STATUS":"stop",
            "PORT":prjPort
          }
          socket.emit("add.nodes",oNode);
          $("#prj-pid").val("Non");
          $("#prj-name").val("");
          $("#path-for-prj").val("");
          $("#prj-port").val("Non");
          $(this).dialog("close");
        },
        Cancel: function () {
          $(this).dialog("close");
        }
      },
      close: function () {
        $( this ).dialog( "close" );
      }
    });

  });

  $("body").delegate("#nodes .status", "click",function (event) {
    var aPos = oTable.fnGetPosition(event.currentTarget.parentNode.parentNode);
    var data = oTable.fnGetData(aPos);
    var status = (data["STATUS"] == "start") ? "stop" : "start";
        socket.emit(status+".nodes",[data]);
  });

  $("body").delegate("#nodes .viewlog", "click", function (event) {
    $("#lognode-dialog code").text("");
    var aPos = oTable.fnGetPosition(event.currentTarget.parentNode.parentNode);
    var data = oTable.fnGetData(aPos);
    data["line"] = 50;
    socket.emit("viewlog.nodes",data);
  });

  $("body").delegate("#nodes [type=checkbox]", "change",function(event){
    if(event.currentTarget.parentElement.nodeName == "TH"){
      var isCheck = event.currentTarget.checked;
      var arrCheck = $("#nodes [type=checkbox]");
      for(var i=0;i<arrCheck.length;i++){
        arrCheck[i].checked = isCheck;
      }
    };
  });

  $("body").delegate(".ss-select", "click", function(evt){
    var arrChk = $(".ss-checkbox");
    var arrNodes = [];
    for(var i = 0 ; i < arrChk.length; i++)
    {
      if(arrChk[i].checked){
        var aPos = oTable.fnGetPosition(arrChk[i].parentElement.parentElement);
        var data = oTable.fnGetData(aPos);
        arrNodes.push(data);
      }
    }
    if(arrNodes.length > 0){
      var iChoose = evt.currentTarget.attributes["index"].value;
      socket.emit(iChoose+'.nodes',arrNodes);
    }
  });

  function processTable(data) {
    if(data){
      $('#dynamic').html('<table cellpadding="0" cellspacing="0" border="0" class="display" id="nodes"></table>');
      var aDataSet = data;
      var customColStatusButton = {
        mData: null,
        bSortable: false,
        sTitle: "Action",
        sClass: "center",
        sDefaultContent: '<input type="button" class="status"></button><input type="button" class="viewlog" value="view log"></button>',
        "fnCreatedCell": function( nCell, sDefault, aData, iDisplayIndex, iDisplayIndexFull ) {
          $(nCell).children()[0].value = (aData["STATUS"] == "start") ? "stop" : "start";
          return nCell;
        }
      }

      var customRowSelect = {
        mData: null,
        bSortable: false,
        sTitle: "<input type='checkbox'>",
        sClass: "center",
        sDefaultContent: '<input class="ss-checkbox" type="checkbox" />'
      }

      var aoColumns = [];
      aoColumns.push(customRowSelect);
      for (var key in aDataSet[0]) {
        if(key == "NAME"){
          var ColName = {
            mData: key,
            sTitle: key,
            sClass: "center",
            "fnCreatedCell": function( nCell, sDefault, aData, iDisplayIndex, iDisplayIndexFull ) {
              $(nCell).html(null);
              $(nCell).append('<a href="http://192.168.10.236:'+aData["PORT"]+'" target="_blank">'+sDefault+'</a>');
              return nCell;
            }
          }
          aoColumns.push(ColName);
        }
        if(key == "STATUS"){
          var ColStatus = {
            mData: key,
            sTitle: key,
            sClass: "center",
            "fnCreatedCell": function( nCell, sDefault, aData, iDisplayIndex, iDisplayIndexFull ) {
              if(aData["STATUS"] == "start")
                $(nCell).addClass('status-start');
              if(aData["STATUS"] == "stop")
                $(nCell).addClass('status-stop');
              if(aData["STATUS"] == "conflict port")
                $(nCell).addClass('status-conflict');
              return nCell;
            }
          }
          aoColumns.push(ColStatus);
        } else {
          aoColumns.push({"mData": key.toString(), "sTitle": key.toString(), "sClass": "center"});
        }
      }

      aoColumns.push(customColStatusButton);

      oTable = $('#nodes').dataTable({
        "aaData": aDataSet,
        "aLengthMenu": [[5, 10, 15, -1], [5, 10, 15, "All"]],
        "iDisplayLength": 5,
        "aoColumns": aoColumns
      });

    }
  }

});

