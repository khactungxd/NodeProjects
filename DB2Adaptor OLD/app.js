var express = require('express');
var app = express();
var routes = require('./routes');
var procedures = require('./routes/procedures.js');
var managerConnect = require('./routes/manager_connect.js');
var path = require('path');

// all environments
app.use(express.cookieParser('very secret'));
app.use(express.session());
app.set('port', process.env.PORT || 3100);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.methodOverride());
app.use(express.bodyParser());
app.use(express.static(path.join(__dirname, 'public')));

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


app.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});