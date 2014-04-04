var child_process = require('child_process');
var fs = require("fs");

main();

function main() {
  checkNode(function () {
    setTimeout(main, 10000);
  })
}

function checkNode(cb) {
  var arrNodes = getJsonNode();
  if (arrNodes.length > 0) {
    child_process.exec("ps aux | grep node | awk '{print $2}'",
      function (error, stdout, stderr) {
        if (!error) {
          var newArrNodes = JSON.stringify(arrNodes);
          if (stdout) {
            var arrPID = stdout.trim().split('\n');
            for (var i = 0; i < arrNodes.length; i++) {
              if (!isNaN(parseFloat(arrNodes[i]["PID"]))) {
                if (arrPID.indexOf(arrNodes[i]["PID"]) < 0 && (arrNodes[i]["STATUS"] == "start" || arrNodes[i]["STATUS"] == "conflict port")) {
                  arrNodes[i]["STATUS"] = "stop";
                  arrNodes[i]["PID"] = "Non";
                } else if (arrPID.indexOf(arrNodes[i]["PID"]) > 0 && arrNodes[i]["STATUS"] == "stop") {
                  arrNodes[i]["STATUS"] = "start";
                }
              }
            }
            if (newArrNodes !== JSON.stringify(arrNodes)) {
              try {
                var file = fs.openSync('./list-service.json', "w");
                fs.writeSync(file, JSON.stringify(arrNodes));
                fs.closeSync(file);
              } catch (e) {
                console.log(e);
              } finally {
                cb()
              }
            } else {
              cb();
            }
          } else {
            var newArrNodes = JSON.stringify(arrNodes);
            for (var i = 0; i < arrNodes.length; i++) {
              if (arrNodes[i]["STATUS"] == "start") {
                arrNodes[i]["STATUS"] = "stop";
                arrNodes[i]["PID"] = "Non";
              }
            }
            if (newArrNodes !== JSON.stringify(arrNodes)) {
              try {
                var file = fs.openSync('./list-service.json', "w");
                fs.writeSync(file, JSON.stringify(arrNodes));
                fs.closeSync(file);
              } catch (e) {
                console.log(e);
              } finally {
                cb()
              }
            } else {
              cb();
            }
          }
        }
      }
    );
  } else {
    cb();
  }
}

//function checkPort(cb){
//  var arrNodes = getJsonNode();
//  setPort(arrNodes , 0, cb);
//}

//function setPort(arrNodes , index, cb){
//  if(index > arrNodes.length-1){
//    cb()
//  }else{
//    child_process.exec("netstat -tulpn | grep "+arrNodes[index]["PID"]+" | awk '{print $4}'",
//      function (error, stdout, stderr) {
//        if(!error){
//          if(stdout){
//            var oldArrNodes = JSON.stringify(arrNodes)
//            var PORT = stdout.slice(stdout.indexOf(":")+1,stdout.length);
//            arrNodes[index]["PORT"] = PORT;
//            if (oldArrNodes !== JSON.stringify(arrNodes)) {
//              try {
//                var file = fs.openSync('./list-service.json', "w");
//                fs.writeSync(file, JSON.stringify(arrNodes));
//                fs.closeSync(file);
//              } catch (e) {
//                console.log(e);
//              } finally {
//                setPort(arrNodes , index+1, cb);
//              }
//            } else {
//              setPort(arrNodes , index+1, cb);
//            }
//          }else {
//            setPort(arrNodes , index+1, cb);
//          }
//        }else{
//          setPort(arrNodes , index+1, cb);
//        }
//      }
//    );
//  }
//}

function getJsonNode() {
  var arrNodes;
  try {
    arrNodes = JSON.parse(fs.readFileSync('./list-service.json').toString());
  } catch (e) {
    console.log(e);
  } finally {
    return arrNodes;
  }
}