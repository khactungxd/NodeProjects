var odbc = require('odbc');
var db2client = new odbc.Database();
var CONFIG = require('../config');
var connString = CONFIG.CONNECTION_STRING;
//var connString = "DRIVER={_driver};DATABASE=_database;UID=_uid;PWD=_password;HOSTNAME=_hostname;PORT=_port;";

/*@schema : {String} Schema name
  @procedure : {String} Procedure name
  @array : {Array} array is items of params to procedure
*/
exports.callProcedures = function(schema, procedure, array, cb){
  db2client.open(connString , function(err){
    if(err){
      cb(err, undefined);
    } else {
      db2client.query("call "+schema+"."+procedure+"("+"?".concat(Array(array.length).join(",?"))+")", array, function (err, rows) {
        if(err){
          cb(err, undefined);
        } else {
          db2client.close(function () {
            cb(null, rows);
          });
        }
      })
    }
  })
}

exports.callProceduresSync = function(schema, procedure, array){
  var rows;
  try{
    db2client.openSync(connString);
    rows = db2client.querySync("call "+schema+"."+procedure+"("+"?".concat(Array(array.length).join(",?"))+")", array);
  } catch (err){
    throw err;
  }finally{
    return rows;
  }
}

exports.selectDataFromTable = function(tableName, colName, options, cb){
  db2client.open(connString , function(err){
    if(err){
      cb(err, undefined);
    } else {
      var colStrList = "*";
      var conditions = "";
      if(colName)
        colStrList = generateCol(colName);
      if(options)
        conditions = generateConditions(options);
      db2client.query("select "+colStrList+" from "+ tableName+conditions, function (err, rows) {
        if(err){
          cb(err, undefined);
        } else {
          db2client.close(function () {
            cb(null, rows);
          });
        }
      })
    }
  })
}

exports.selectDataFromTableSync = function(tableName, colName, options){
  var rows;
  try{
    db2client.openSync(connString);
    var colStrList = "*";
    var conditions = "";
    if(colName)
      colStrList = generateCol(colName);
    if(options)
      conditions = generateConditions(options);
    rows = db2client.querySync("select "+colStrList+" from "+ tableName+conditions);
  }catch (e){
    throw e;
  }finally{
    return rows;
  }
}

function generateCol(arrayCol){
  var strCol = "";
  for(var i = 0 ; i < arrayCol.length ; i++){
    if(i == arrayCol.length -1)
      strCol = strCol + arrayCol[i];
    else
      strCol = strCol + arrayCol[i] +",";
  }
  return strCol;
}

function generateConditions(options){
  var conditions = "";
  for(var key in options){
    conditions = conditions + " " + key + " " + options[key];
  }
  return conditions;
}