// my_queue

// documentation via: haraka -c /NodeProjects/MailServer -h plugins/my_queue

// Put your plugin code here
// type: `haraka -h Plugins` for documentation on how to create a plugin

exports.hook_queue = function(next, connectioan,params) {
  next(OK);
};