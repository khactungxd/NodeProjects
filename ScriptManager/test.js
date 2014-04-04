var child_process = require('child_process');
var fs = require("fs");
var async = require('async');
var rootProject = "/NodeProjects/RMS/";
var path = require('path');


child_process.exec("ls", function (e1, out1, err1) {
  console.log('step 1')
  console.log(e1, out1,err1);
  child_process.exec("cd "+rootProject +" && ls", function (e, out, err) {
    console.log('step 2')
    console.log(e, out,err);
    child_process.exec("ls",
      function (error, stdout, stderr) {
        console.log('step 3')
        console.log(error, stdout, stderr);
      }
    );
  })
})

function getJsonNode() {
  var arrNodes;
  try {
    arrNodes = JSON.parse(fs.readFileSync('list-service.json').toString());
  } catch (e) {
    console.log(e);
  } finally {
    return arrNodes;
  }
}