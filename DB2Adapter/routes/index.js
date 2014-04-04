/**
 * Created with JetBrains PhpStorm.
 * User: HaLongBay
 * Date: 12/10/13
 * Time: 11:16 AM
 * To change this template use File | Settings | File Templates.
 */

var CONFIG = require('../config')

exports.index = function(req, res, db){
  db.query("select schemaname from syscat.schemata", function (err, rows) {
    console.log(err);
    db.close(function () {
      console.log("Connection Closed");
      res.render('index',{rows : rows, title: "db2"});
    });
  })
//  db.open(req.session["connectionString"], function (err) {
//    if (err) {
//      console.error("error: ", err.message);
//      db.close(function () {
//        console.log("Connection Closed");
//      });
//    } else {
//      db.query("select schemaname from syscat.schemata", function (err, rows) {
//        console.log(err);
//        db.close(function () {
//          console.log("Connection Closed");
//          res.render('index',{rows : rows, title: "db2", test: "test"});
//        });
//      })
//    }
//  });

}