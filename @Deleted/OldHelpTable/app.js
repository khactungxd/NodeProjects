
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
	,ajax = require('./routes/ajax.js')
  , http = require('http')
  , path = require('path');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3006);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/helpTable', routes.showHelpTable);
app.post('/helpTable', routes.showHelpTable);
app.get('/ajax', ajax.index);
app.get('/downloadCSV', routes.downloadCSV);
/*
app.get('/listJS', routes.showListJS);
app.get('/autoComplete', routes.showAutoComplete);
*/

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
