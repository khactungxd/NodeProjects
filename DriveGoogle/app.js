//-------------------- DEPENDENCIES -------------------------
var express = require('express');
var path = require('path');
var app = express();

//-------------------- LOAD GOOGLEAPIS OAUTH ------------------------
var CONFIG = require('./config.json');

//-------------------- REQUIRE ROUTES ---------------------------
var Index = require('./routes');
var Upload = require('./routes/upload.js');

//------------------  INCLUDE GoogleDriveHelper -------------------------
var GoogleDriveHelper = require('./Include/GoogleDriveHelper.js');
var googleDrive = new GoogleDriveHelper(CONFIG.SERVER);

// ---------------- EXPRESS CONFIGURE ------------------
app.configure(function(){
  app.use(express.cookieParser());
  app.use(express.session({secret: '1234567890QWERTY'}));
  app.set('port', process.env.PORT || 3400);
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'jade');
  app.use(express.logger('dev'));
  app.use(express.favicon());
  app.use(express.bodyParser({
    keepExtensions: true,
    uploadDir: __dirname + '/tmp',
    limit: '15mb'
  }));
  app.use(app.router);
  app.use(express.methodOverride());
  app.use(express.static(path.join(__dirname, 'public')));
});

app.get("/", function(req , res){
  Index.index(req, res, googleDrive);
});

app.get("/get/drive/list", function(req , res){
  Index.getDriveList(req, res, googleDrive);
});

app.get('/oauth2callback', function(req, res){
  var code = req.query["code"];
  req.session["code"] = code;
  res.redirect("/");
});

app.post('/upload', function(req, res){
  Upload.upload(req, res, googleDrive);
});

app.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});