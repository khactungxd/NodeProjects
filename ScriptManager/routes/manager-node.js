var child_process = require('child_process');
var fs = require("fs");
var async = require('async');
var BASELOGPATH = "/NodeProjects/log/";
var path = require('path');

exports.stopProcessNode = function (arrNodes, cb) {
  async.map(arrNodes, killNode, function (err, result) {
    cb();
  })
}

exports.startProcessNode = function (arrNodes, cb) {
  async.map(arrNodes, checkNode, function (err, result) {
    cb();
  })
}

exports.deleteProcessNode = function (arrNodes, cb) {
  async.map(arrNodes, killNode, function (err, result) {
    async.map(arrNodes, deleteNodes, function (err, result) {
      cb()
    })
  })
}

exports.addProcessNode = function (oNode, cb) {
  var arrNodes = getJsonNode();
  var exist = false;
  for (var i = 0; i < arrNodes.length; i++) {
    if (JSON.stringify(oNode) == JSON.stringify(arrNodes[i])) {
      exist = true;
    }
  }
  if (exist) {
    cb();
  } else {
    arrNodes.push(oNode);
    try {
      var file = fs.openSync('./list-service.json', "w");
      fs.writeSync(file, JSON.stringify(arrNodes));
      fs.closeSync(file);
    } catch (e) {
      console.log(e);
    } finally {
      cb()
    }
  }
}

exports.viewLogProcessNode = function (oNode, cb) {
  var Name = oNode["NAME"] + '.txt';
  var fileLogPath = BASELOGPATH + Name;
  var line = oNode["line"] ? oNode["line"] : 10;
  try {
    if (!fs.existsSync(fileLogPath)) {
      cb();
    } else {
      child_process.exec("tail -n "+line+" "+fileLogPath,
        function (error, stdout, stderr) {
          cb({"node" : oNode, "log" : stdout});
        });
    }
  } catch (e) {
    console.log(e);
  }
}

checkNode = function (oNode, cb) {
  if (oNode["STATUS"] == "start" || !fs.existsSync(oNode["DIR"])) {
    cb();
  } else {
    if (oNode["STATUS"] == "conflict port") {
      child_process.exec("netstat -tulpn | grep :" + oNode["PORT"] + " | awk '{print $7}'",
        function (error, stdout, stderr) {
          if (!error) {
            if (stdout) {
              oNode["PID"] = stdout.indexOf('\n') > 1 ? stdout.split('\n')[0].replace('/node','') : stdout.replace('/node','');
              killNode(oNode, function () {
                startNode(oNode, function () {
                  cb();
                })
              });
            } else {
              startNode(oNode, function () {
                cb();
              })
            }
          } else {
            cb();
          }
        }
      );
    } else {
      if (!isNaN(parseFloat(oNode["PORT"]))) {
        child_process.exec("netstat -tulpn | grep :" + oNode["PORT"] + " | awk '{print $4}'",
          function (error, stdout, stderr) {
            if (!error) {
              if (stdout) {
                var arrNodes = getJsonNode();
                var oldArrNodes = JSON.stringify(arrNodes)
                for (var i = 0; i < arrNodes.length; i++) {
                  if (arrNodes[i]["NAME"] == oNode["NAME"]) {
                    arrNodes[i]["STATUS"] = "conflict port";
                    break;
                  }
                }
                if (oldArrNodes !== JSON.stringify(arrNodes)) {
                  try {
                    var file = fs.openSync('./list-service.json', "w");
                    fs.writeSync(file, JSON.stringify(arrNodes));
                    fs.closeSync(file);
                  } catch (e) {
                    console.log(e);
                  } finally {
                    cb();
                  }
                } else {
                  cb();
                }
              } else {
                startNode(oNode, function () {
                  cb();
                });
              }
            } else {
              cb()
            }
          }
        );
      } else {
        startNode(oNode, function () {
          cb();
        });
      }

    }
  }
}

startNode = function (oNode, cb) {
  var rootProject = path.dirname(oNode["DIR"]);
  var projectRunFile = path.basename(oNode["DIR"]);
  child_process.exec("cd "+rootProject+" && nohup node " + projectRunFile + " > " + BASELOGPATH + oNode["NAME"] + ".txt 2>&1 < /dev/null & echo $!",
    function (error, stdout, stderr) {
      if (!error) {
        if (stdout) {
          var arrNodes = getJsonNode();
          for (var i = 0; i < arrNodes.length; i++) {
            if (arrNodes[i]["NAME"] == oNode["NAME"]) {
              arrNodes[i]["STATUS"] = "start";
              arrNodes[i]["PID"] = stdout.split("\n").shift();
            }
          }
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
          cb()
        }
      } else {
        cb()
      }
    }
  );
}

killNode = function (oNode, cb) {
  child_process.exec("kill " + oNode["PID"],
    function (error, stdout, stderr) {
      if (!error) {
        if (!stdout) {
          var arrNodes = getJsonNode();
          var newArrNodes = JSON.stringify(arrNodes);
          for (var i = 0; i < arrNodes.length; i++) {
            if (arrNodes[i]["NAME"] == oNode["NAME"] && arrNodes[i]["STATUS"] == "start") {
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
        } else {
          cb()
        }
      } else {
        cb()
      }
    }
  );
}

deleteNodes = function (oNode, cb) {
  var arrNodes = getJsonNode();
  for (var i = 0; i < arrNodes.length; i++) {
    if (JSON.stringify(arrNodes[i]) == JSON.stringify(oNode)) {
      arrNodes.splice(i, 1);
      try {
        var file = fs.openSync('./list-service.json', "w");
        fs.writeSync(file, JSON.stringify(arrNodes));
        fs.closeSync(file);
      } catch (e) {
        console.log(e);
      } finally {
        try {
          var stdOut = "/NodeProjects/log/" + oNode["NAME"] + ".txt";
          if (fs.existsSync(stdOut)) {
            fs.remove(stdOut);
          }
        } catch (e) {
          console.log(e)
        } finally {
          cb();
        }
      }
    }
  }
}

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
