var express = require('express')
var app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);
var path = require('path');
var socket = require('./routes/socketio.js');

io.set('browser client gzip', true);
io.set('browser client minification', true);  // send minified client
io.set('browser client etag', true);          // apply etag caching logic based on version number
//io.set('transports', [
//   'xhr-polling'
//  , 'websocket'
//  , 'flashsocket'
//  , 'htmlfile'
//  , 'jsonp-polling'
//]);

app.use(express.cookieParser('very secret'));
app.use(express.session());
app.set('port', process.env.PORT || 3200);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.methodOverride());
app.use(express.compress());
app.use(express.bodyParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/',function(req,res){
  res.render('index',{title : "Script Manager"});
})

io.sockets.on('connection', socket.init);

server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});