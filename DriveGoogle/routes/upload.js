var fs = require("fs-extra");

exports.upload = function(req, res, googleDrive){
  if(!req.session["token"]){
    req.session["code"] = undefined;
    fs.removeSync(req.files["myFile"]["path"]);
    res.send({"success" : false,"redirect" : googleDrive.url});
  } else {
    var token = req.session["token"];
    googleDrive.uploadToDrive(token, req.files["myFile"], function(err, result){
      if(err){
        fs.removeSync(req.files["myFile"]["path"]);
        req.session["code"] = undefined;
        res.send({"success" : false,"redirect" : googleDrive.url});
      }else{
        res.send({"success" : true, "filename" : req.files["myFile"]["name"]});
      }
    })
  }
}