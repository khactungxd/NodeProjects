/**
 * Created with JetBrains PhpStorm.
 * User: HaLongBay
 * Date: 12/10/13
 * Time: 3:37 PM
 * To change this template use File | Settings | File Templates.
 */

var CONFIG = require('../config')

exports.getListProcedures = function(req, res, db){
  db.query("select SPECIFICNAME, PROCNAME from syscat.procedures where procschema = '"+req.params.schema+"'", function (err, rows) {
    console.log(err);
    db.close(function () {
      console.log("Connection Closed");
      res.render('option_procedures',{rows : rows});
    });
  })
//  db.open(req.session["connectionString"], function (err) {
//    if (err) {
//      console.error("error: ", err.message);
//      db.close(function () {
//        console.log("Connection Closed");
//      });
//    } else {
//      db.query("select SPECIFICNAME, PROCNAME from syscat.procedures where procschema = '"+req.params.schema+"'", function (err, rows) {
//        console.log(err);
//        console.log(rows);
//        db.close(function () {
//          console.log("Connection Closed");
//          res.render('option_procedures',{rows : rows});
//        });
//      })
//    }
//  });
}

exports.processProcedures = function(req, res, db){
  var oProcedures = req.body;
  if(!oProcedures["params"]){
    db.query("select * from syscat.ROUTINEPARMS where SPECIFICNAME='"+oProcedures["specific_name"]+"'", function (err, rows, params) {
      console.log(err);
      if(rows.length > 0){
        db.close(function () {
          console.log("yep params");
          console.log("Connection Closed");
          res.render('form_procedure',{rows : rows});
        });
      } else {
        db.query("call "+oProcedures["schema"]+"."+oProcedures["procedure_name"]+"()", function (err, rows) {
          console.log(err);
          db.close(function () {
            console.log("if No params ");
            console.log("Connection Closed");
            res.send({rows : rows});
          });
        })
      }
    })
  } else {
    db.query("call "+oProcedures["schema"]+"."+oProcedures["procedure_name"]+"("+"?".concat(Array(oProcedures["params"].length).join(",?"))+")", oProcedures["params"], function (err, rows) {
      console.log(err);
      db.close(function () {
        console.log("Connection Closed");
        res.send({rows : rows});
      });
    })
  }
//  db.open(req.session["connectionString"], function (err) {
//    if (err) {
//      console.error("error: ", err.message);
//      db.close(function () {
//        console.log("Connection Closed");
//      });
//    } else {
//      if(!oProcedures["params"]){
//        db.query("select * from syscat.ROUTINEPARMS where SPECIFICNAME='"+oProcedures["specific_name"]+"'", function (err, rows, params) {
//          console.log(err);
//          console.log(rows);
//          if(rows.length > 0){
//            db.close(function () {
//              console.log("yep params");
//              console.log("Connection Closed");
//              res.render('form_procedure',{rows : rows});
//            });
//          } else {
//            db.query("call "+oProcedures["schema"]+"."+oProcedures["procedure_name"]+"()", function (err, rows) {
//              console.log(err);
//              console.log(rows);
//              db.close(function () {
//                console.log("if No params ");
//                console.log("Connection Closed");
//                res.send({rows : rows});
//              });
//            })
//          }
//        })
//      } else {
//        db.query("call "+oProcedures["schema"]+"."+oProcedures["procedure_name"]+"("+"?".concat(Array(oProcedures["params"].length).join(",?"))+")", oProcedures["params"], function (err, rows) {
//          console.log(err);
//          console.log(rows);
//          db.close(function () {
//            console.log("Connection Closed");
//            res.send({rows : rows});
//          });
//        })
//      }
//    }
//  });
}

