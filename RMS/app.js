// =========================== DEPENDENCIES ==============================
var express = require('express');
var http = require('http')
var path = require('path');
var config=require('./config.js');
//var redis2palo=require('./includes/redis2palo.js');

// ========================== 4 MAIN MODULES =============================
var mWebservice=require('./routes/webservice.js'); 	// "m" stands for module. Get data from Palo via Palo HTTP API
var mBrowser=require('./routes/browser.js');	   	// Query to Webservice and show RMS data on screen
var mClient=require('./routes/client.js'); 	  		// Simulate RMS client(s) to send requests to RMS server --> push data into Palo

// ===================== EXPRESS APP CONFIGURATION ==============================
var app = express();
app.configure(function(){
  app.set('port', process.env.PORT || config.RMS_PORT);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
  //app.use('/browser', express.static(__dirname + '/public'));
});

// ============================== ROUTES  ================================
var prefix="";

app.get('/', mBrowser.main);
app.get('/browser', mBrowser.main);
app.get(prefix+'/client', mClient.main);
app.get(prefix+'/webservice', mWebservice.main);
    app.get(prefix+'/webservice/supermandant/list', mWebservice.supermandants);
    app.get(prefix+'/webservice/mandant/list', mWebservice.mandants);
    app.get(prefix+'/webservice/location/list', mWebservice.locations);
    app.get(prefix+'/webservice/activity/list', mWebservice.activities);

    app.get(prefix+'/webservice/data/recent', mWebservice.recent_data);
    app.get(prefix+'/webservice/data/by_location', mWebservice.data_by_location);
    app.get(prefix+'/webservice/data/by_activity', mWebservice.data_by_activity);
    app.get(prefix+'/webservice/data/by_year', mWebservice.data_by_year);
    app.get(prefix+'/webservice/data/by_month', mWebservice.data_by_month);
    app.get(prefix+'/webservice/data/by_day', mWebservice.data_by_day);
    app.get(prefix+'/webservice/data/by_hour', mWebservice.data_by_hour);
    app.get(prefix+'/webservice/data/by_orgunit', mWebservice.data_by_orgunit);
    app.get(prefix+'/webservice/data/for_map', mWebservice.data_for_map);

    app.get(prefix+'/webservice/request/list', mWebservice.requests);
    app.post('/webservice/request/add', mWebservice.add_request);

// =========================== START EXPRESS ==============================
http.createServer(app).listen(app.get('port'), function(){
  console.log("RMS server listening on port " + app.get('port'));
});

//redis2palo.start();
