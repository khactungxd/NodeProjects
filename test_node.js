var email = require("emailjs");
var server  = email.server.connect({
  user:    "admin",
  password:"admin",
  host:    "localhost",
  ssl:     false
});

server.send({
  text:    "i hope this works",
  from:    "admin@vn.oxseed.com",
  to:      "manhha1006@gmail.com",
  subject: "testing emailjs"
}, function(err, message) { console.log(err || message); });