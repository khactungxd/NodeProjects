
/*
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  ,info = require('./routes/info')
   ,mapview = require('./routes/mapview')
  , http = require('http')
  , path = require('path');

var app = express();

var  data_by_locations = require('./routes/data_by_location.js');
var data_by_activities = require('./routes/data_by_activity.js');
var getSupermandantList = require('./routes/getSupermandantList.js');
var getMandantList = require ('./routes/getMandantList.js');
var getLocationList = require ('./routes/getLocationList.js');
var getActivityList = require ('./routes/getActivityList.js');
var getRecentData = require ('./routes/getRecentData.js');
var data_by_year = require ('./routes/data_by_year.js');
var data_by_month = require ('./routes/data_by_month.js');
var data_by_day = require ('./routes/data_by_day.js');
var data_by_hour = require ('./routes/data_by_hour.js');
var data_for_map = require('./routes/data_for_map');
app.configure(function(){
  app.set('port', process.env.PORT || 3003);
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
//RMS client
app.get('/', routes.index);
app.get('/info', info.index);
app.get('/mapview', mapview.index);

//RMS web service
app.get('/data_by_location',data_by_locations.main);
app.get('/data_by_activity',data_by_activities.main);
app.get('/supermandants',getSupermandantList.main);
app.get('/locations',getLocationList.main); 
app.get('/activities',getActivityList.main); 
app.get('/recent_data',getRecentData.main);
app.get('/mandants',getMandantList.main);
app.get('/data_by_year',data_by_year.main);
app.get('/data_by_month',data_by_month.main);
app.get('/data_by_day',data_by_day.main);
app.get('/data_by_hour',data_by_hour.main);
app.get('/data_for_map',data_for_map.main);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
