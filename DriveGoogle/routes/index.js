
exports.index = function(req, res, googleDrive){
  if(!req.session || !req.session["code"]){
    res.redirect(googleDrive.url);
  } else {
    googleDrive.getToken(req.session["code"],function(err, token){
      if(err) {
        req.session["code"] = undefined;
        res.redirect(googleDrive.url);
      } else {
        if(req.session["token"] || req.session["token"] != token)
          req.session["token"] = token;
        googleDrive.getFilesList(token, function(err, documents){
          if(!err){
            res.render('index', documents);
          }
        });
      }
    });
  }
}

exports.getDriveList = function(req, res, googleDrive){
  if(!req.session || !req.session["code"]){
    res.send({"success" : false,"redirect" : googleDrive.url});
  } else {
    if(!req.session["token"]){
      req.session["code"] = undefined;
      res.send({"success" : false,"redirect" : googleDrive.url});
    } else {
      var token = req.session["token"];
      googleDrive.getFilesList(token, function(err, documents){
        if(!err){
          res.render('filelist.jade', documents)
        }
      });
    }
  }
};