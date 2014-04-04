/**
 * Created with JetBrains PhpStorm.
 * User: HaLongBay
 * Date: 12/17/13
 * Time: 3:41 PM
 * To change this template use File | Settings | File Templates.
 */

var child_process = require("child_process");
var parentDir = "D:\New_Folder";
//var parentDir = "/NodeProjects";
var path = require("path");
var fs = require("fs");
var mnNode = require("./manager-node.js")

exports.init = function (socket) {
  socket.emit("connected", {"status": "success"});

  socket.on("get.list.node", function () {
    var obj = getJsonNode();
    socket.emit("end.list.node",obj);
  });

  socket.on("register.event.list.node",function(){
    var obj = getJsonNode();
    socket.emit("pipe.list.node",obj);
    fs.watch("./list-service.json", function (event, filename) {
      console.log("event is: " + event);
      if (event == "change") {
        var obj = getJsonNode();
        socket.emit("pipe.list.node",obj);
      }
    });
  });

  socket.on("stop.nodes", function(arrNodes){
    console.log(arrNodes);
    mnNode.stopProcessNode(arrNodes, function(){

    })
  });

  socket.on("start.nodes", function(arrNodes){
    mnNode.startProcessNode(arrNodes, function(){

    })
  });

  socket.on("delete.nodes", function(arrNodes){
    mnNode.deleteProcessNode(arrNodes, function(){

    })
  });

  socket.on("add.nodes",function(arrNodes){
    mnNode.addProcessNode(arrNodes,function(){});
  });

  socket.on("viewlog.nodes",function(oNode){
    mnNode.viewLogProcessNode(oNode,function(log){
      if(log){
        socket.emit("end.viewlog.nodes",log);
      }
    });
  });

}


function getJsonNode() {
  var arrNodes;
  try {
    arrNodes = JSON.parse(fs.readFileSync("./list-service.json").toString());
  } catch (e) {
    console.log(e);
  } finally {
    return arrNodes;
  }
}
