var express = require('express');
var app = express();
//var routes = require('./routes');
//var procedures = require('./routes/procedures.js'); 
//var managerConnect = require('./routes/manager_connect.js');
var path = require('path');
var ws=require('./routes/webservice.js');

// all environments
app.use(express.bodyParser());
app.use(express.cookieParser('very secret'));
app.use(express.session());
app.set('port', process.env.PORT || 3030);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.methodOverride());
app.use(express.bodyParser());
app.use(express.static(path.join(__dirname, 'public')));

app.configure(function(){
  app.use(express.bodyParser());
});

// WEBSERVICE ENDPOINTS
app.post("/process/list", ws.process_list);
app.post("/process/forward",ws.process_forward);
app.post("/process/entnehmen",ws.process_entnehmen);
app.post("/process/archive",ws.process_archive);
app.post("/process/resubmit",ws.process_resubmit);
app.post("/process/sendback",ws.process_sendback);
app.post("/process/edit",ws.process_edit);
app.post("/process/skip",ws.process_skip);
app.post("/process/combine",ws.process_combine);
app.post("/process/split",ws.process_split);
app.post("/process/letter/list",ws.process_entnehmen);
app.post("/process/notice/list",ws.process_notice_list);
app.post("/process/notice/edit",ws.process_notice_edit);
app.post("/process/notice/invalidate",ws.process_notice_invalidate);
app.post("/process/notice/add",ws.process_notice_add);
app.post("/process/notice/delete",ws.process_notice_delete);

app.post("/document/list", ws.document_list);
app.post("/document/edit", ws.document_edit);
app.post("/document/history/list", ws.document_history_list);
app.post("/document/sendung/list", ws.document_sendung_list);
app.post("/document/archive", ws.document_archive);
app.post("/document/resubmit", ws.document_resubmit);
app.post("/document/sendback", ws.document_sendback);
app.post("/document/split", ws.document_split);
app.post("/document/forward", ws.document_forward);

//app.post("/document/notice/list", ws.document_notice_list);
app.post("/document/notice/edit", ws.document_notice_edit);
app.post("/document/notice/invalidate", ws.document_notice_invalidate);
app.post("/document/notice/add", ws.document_notice_add);
app.post("/document/notice/delete", ws.document_notice_delete);


/*
 app.get('/', function(req, res){
 managerConnect.isValid(req, res, function(db){
 routes.index(req, res, db);
 })
 });
 app.get('/procedures/:schema', function(req, res){
 managerConnect.isValid(req, res, function(db){
 procedures.getListProcedures(req, res, db);
 })
 });
 app.post('/procedures/run', function(req, res){
 managerConnect.isValid(req, res, function(db){
 procedures.processProcedures(req, res, db);
 })
 });
 app.get('/connection',function(req,res){
 managerConnect.formConnect(req, res);
 });
 app.post('/set_connect',function(req,res){
 managerConnect.setConnect(req, res);
 })
 */


app.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

