//----------------- Dependencies -------------------
var googleapis = require('googleapis');
var fs = require("fs-extra");

var self;

//----------------- Auth and generate url auth with scope --------------
/*
* @options {Object}
*   options.clientID {String} google api client ID
*   options.clientSecret {String} google api Secret key
*   options.redirectURL {String} google api redirect URL
*   options.scope {String} google api scope
*/
var GoogleDriveHelper = function(options){
  self = this;
  //create object googleapis with clientID, clientSecret and redirectURL
  this.auth = new googleapis.OAuth2Client(options.clientID, options.clientSecret, options.redirectURL);
  //generate url for Oauth with scope
  this.url = this.auth.generateAuthUrl({ scope: options.scope });
};
//----------------- google api get token with code ------------------------------------
/*
* code {String} code is return string by google api after auth
* cb {function} is function after get token success
*/
GoogleDriveHelper.prototype.getToken = function(code, cb){
  if(typeof code == "function" || typeof code !== "string"){
    cb("Code is not format");
  } else {
    googleapis.discover('drive', 'v2').execute(function(err, client) {
      self.auth.getToken(code, function(err, tokens) {
        if (err) {
          cb(err, undefined);
        } else {
          cb(null, tokens);
        }
      });
    });
  }
};

//--------------------- get files list for drive ------------------------
/*params :
* @token : google api token
* @params : ........
* */
GoogleDriveHelper.prototype.getFilesList = function(token, params, cb){
  if(typeof  params == "function"){
    cb = params;
  }
  googleapis.discover('drive', 'v2').execute(function(err, client) {
    var auth = self.auth;
    //set token to credentials of auth
    auth.credentials = token;
    client.drive.files
      .list()
      .withAuthClient(auth).execute(cb);
  });
};

//-------------------- upload document to drive ----------------------
/*
* @token {String} google api token
* @params {Object} information Files upload
* */
GoogleDriveHelper.prototype.uploadToDrive = function(token, params, cb){
  if(typeof  params == "function"){
    cb = params;
    cb("Files upload not exist");
  } else {
    googleapis.discover('drive', 'v2').execute(function(err, client) {
      var auth = self.auth;
      //set token to credentials of auth
      auth.credentials = token;
      fs.readFile(params["path"], function(err, data){
        if(err){
          cb(err);
        }else {
          client.drive.files
            .insert({ title: params["name"].split(".").shift(), mimeType: params["type"] })
            .withMedia(params["type"], data)
            .withAuthClient(auth).execute(cb);
        }
      })
    });
  }

};

module.exports = GoogleDriveHelper;