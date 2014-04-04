// rcpt_to.disposable

// documentation via: haraka -c /NodeProjects/MailServer -h plugins/rcpt_to.disposable

// Put your plugin code here
// type: `haraka -h Plugins` for documentation on how to create a plugin
// rcpt_to.disposable
// Put your plugin code here
// type: `haraka -h Plugins` for documentation on how to create a plugin

var fs = require("fs");

exports.register = function () {
  this.register_hook('queue','myQueue');
  this.register_hook('rcpt', 'myRcpt');
}

var zeroPad = exports.zeroPad = function (n, digits) {
  n = n.toString();
  while (n.length < digits) {
    n = '0' + n;
  }
  return n;
}

exports.myQueue = function (next, connection, params) {
  var self = this;
  var baseDir = "/NodeProjects/MailServer";
  var boxName = "inbox";
  var tmpName = "tmp";
  //Get information user
  var user = connection.notes.quarantine;
  var usrInbox = [ baseDir ,boxName, user ].join('/');

  var d = new Date();
  var yyyymmdd = d.getFullYear() + "-" + zeroPad(d.getMonth()+1, 2) + "-" + this.zeroPad(d.getDate(), 2);
  var transactionID = connection.transaction.uuid.split(".").shift();
  var fileExtension = ".eml";

  var name = [ yyyymmdd, transactionID ].join('_') + fileExtension;

  var ws = fs.createWriteStream([ baseDir, tmpName, name ].join('/'));
  ws.on('error', function (err) {
    connection.logerror(self, 'Error writing mail file: ' + err.message);
    next(DENY, 'Error writing quarantine file: ' + err);
  });
  ws.on('close', function () {
    self.loginfo("\n\n\n\n\n\n***************************");
    fs.link([ baseDir, tmpName, name ].join('/'), [ usrInbox, name ].join('/'),
      function (err) {
        if (err) {
          next(DENY, 'Error writing quarantine file: ' + err);
        }
        else {
          // Add a note to where we stored the message
//          connection.transaction.notes.quarantined = [ usrInbox, name ].join('/');
          connection.loginfo(self, 'Stored copy of message in quarantine: ' +
            [ usrInbox, name ].join('/'));
          // Now delete the temporary file
          fs.unlink([ baseDir, tmpName, name ].join('/'), function () {
            next();
          });

        }
      }
    );
  });
  connection.transaction.message_stream.pipe(ws, { line_endings: '\n' });
};

exports.myRcpt = function(next, connection,params) {
  var rcpt = params[0];
  connection.notes.quarantine = rcpt.user;
  var baseDir = "/NodeProjects/MailServer";
  var usrInbox = [ baseDir ,"inbox", rcpt.user ].join('/');
  if(fs.existsSync(usrInbox) && fs.lstatSync(usrInbox).isDirectory()){
    next();
  }else {
//    next(DENY, "User "+rcpt.user+ " can not found");
    next();
  }
};

exports.hook_delivered = function(next){
  this.loginfo("****************\n\n\n");
  this.loginfo("HOOK_DELIVERED");
  this.loginfo("\n\n\n****************\n\n\n");
  next();
};