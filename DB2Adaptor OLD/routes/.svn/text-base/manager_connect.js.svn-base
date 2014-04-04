/**
 * Created with JetBrains PhpStorm.
 * User: HaLongBay
 * Date: 12/11/13
 * Time: 5:48 PM
 * To change this template use File | Settings | File Templates.
 */

var odbc = require('odbc');
var db = new odbc.Database();

exports.formConnect = function(req, res){
  if(req.session["connectionString"]){
    db.open(req.session["connectionString"], function (err) {
      if (err) {
        console.error("error: ", err.message);
        db.close(function () {
          console.log("Connection Closed");
          res.render("create_config");
        });
      } else {
        db.close(function () {
          console.log("Connection Closed");
          res.redirect("/");
        });
      }
    });
  } else {
    res.render("create_config");
  }
}

exports.setConnect = function(req, res){
  if(req.body){
    var oConnection = req.body;
    if(!oConnection["driver"] || !oConnection["hostname"] || !oConnection["port"] || !oConnection["database"] || !oConnection["uid"] || !oConnection["password"]){
      res.redirect("/connection");
    } else {
      var connectionString = "DRIVER={_driver};DATABASE=_database;UID=_uid;PWD=_password;HOSTNAME=_hostname;PORT=_port;";
      connectionString = connectionString
        .replace('_driver',oConnection["driver"])
        .replace('_database',oConnection["database"])
        .replace('_uid',oConnection["uid"])
        .replace('_password',oConnection["password"])
        .replace('_hostname',oConnection["hostname"])
        .replace('_port',oConnection["port"]);
      db.open(connectionString, function (err) {
        if (err) {
          console.error("error: ", err.message);
          db.close(function () {
            console.log("Connection Closed");
            res.redirect("/connection");
          });
        } else {
          db.close(function () {
            console.log("Connection Closed");
            req.session["connectionString"] = connectionString;
            res.redirect("/");
          });
        }
      });
    }
  }
}

exports.isValid = function(req, res, cb){
  if(req.session["connectionString"]){
    db.open(req.session["connectionString"], function (err) {
      if (err) {
        console.error("error: ", err.message);
        db.close(function () {
          console.log("Connection Closed");
          res.redirect("/connection");
        });
      } else {
        cb(db);
      }
    });
  } else {
    res.redirect("/connection");
  }
}