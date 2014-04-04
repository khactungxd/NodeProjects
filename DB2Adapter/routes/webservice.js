var fs = require('fs');
var querySTRING = require( "querystring" );

var DATETIME="2013-12-31T23:59:59";
var STRING="STRING";
var BOOLEAN=true;
var NUMBER=1;
var SHORT="2013-12-31";
// NOTE: (t) means TEXT type. (n) means NUMBER type

// ============== PROCESS ===================

exports.process_list =  function(req, res){
	/* POST PARAMS: 
	process(t)
	useraction(t)
	RequestId(n)
	SessionContext { BackEndSessionId(n),  UserContext{UserID(n), UserName(t)} }
	WorkBasketKey { WorkBasketID(n), WorkBasketTypeID(n) }
	FilterIDList []
	*/
	
	// if success=false, return err object {"errornumber":STRING,"errortxt":[STRING,...]} 	
	// req.body ==> js object ==> res.send(JSON.stringify(req.body));
	
	var result={
	  "resultinfo": { "success": true },
	  "processList": [ 
		{
		  "tsprocess": DATETIME,
		  "tslastupdate": DATETIME,
		  "prio": NUMBER,
		  "partition": NUMBER,
		  "resubdate": DATETIME,
		  "type": NUMBER,
		  "state":NUMBER,
		  "scnr": STRING,
		  "vdnr": STRING,
		  "vmnr": STRING,
		  "vwhnr": STRING,
		  "vnr": STRING,
		  "sectionId": NUMBER,
		  "inkarnation": NUMBER,
		  "info": {
			"data": {
			  "count": {
				"doc": NUMBER,
				"notice": NUMBER
			  },
			  "lock": STRING,
			  "valid": STRING,
			  "pname": STRING,
			  "longinfo": STRING
			},
			"letter": {
			  "exist": BOOLEAN,
			  "state": NUMBER,
			  "showpdf": { 
				"doctype":STRING,
			"objectid":STRING
			 }
			}
		  },
		  "recbasketid": STRING
		}
	  ]
	};
	
	res.send(JSON.stringify(result));
	
}

exports.process_forward =  function(req, res){
	var result={
    "resultinfo": {"success": true}
  };

  res.send(JSON.stringify(result));
}

exports.process_entnehmen = function(req, res){
	var result={
    "resultinfo": {"success": true}
  };

  res.send(JSON.stringify(result));
}

exports.process_archive = function(req, res){
  var result={
    "resultinfo": {"success": true}
  };

  res.send(JSON.stringify(result));
}

exports.process_resubmit = function(req, res){
  var result={
    "resultinfo": {"success": true}
  };

  res.send(JSON.stringify(result));
}

exports.process_sendback = function(req, res){
  var result={
    "resultinfo": {"success": true}
  };

  res.send(JSON.stringify(result));
}

exports.process_edit = function(req, res){
  var result={
    "resultinfo": {"success": true}
  };

  res.send(JSON.stringify(result));
}

exports.process_skip = function(req, res){
  var result={
    "resultinfo": {"success": true}
  };

  res.send(JSON.stringify(result));
}

exports.process_combine = function(req, res){
  var result={
    "resultinfo": {"success": true}
  };

  res.send(JSON.stringify(result));
}

exports.process_split = function(req, res){
  var result={
    "resultinfo": {"success": true}
  };

  res.send(JSON.stringify(result));
}

//exports.process_entnehmen = function(req, res){
//  var result={};
//
//  res.send(JSON.stringify(result));
//}

exports.process_notice_list = function(req, res){
  var result={
    "resultinfo": {"success": true},
    "eventList": [
        {
            "date": DATETIME,
            "operation": SHORT,
            "username": STRING,
            "subject": STRING,
            "infotext": STRING,
            "userid": STRING,
            "validstateid": SHORT,
            "schutzklasse": SHORT,
            "archivetime": DATETIME,
            "partition": SHORT
        }
    ]
  };

  res.send(JSON.stringify(result));
}

exports.process_notice_edit = function(req, res){
  var result={
    "resultinfo": {"success": true}
  };

  res.send(JSON.stringify(result));
}

exports.process_notice_invalidate = function(req, res){
  var result={
    "resultinfo": {"success": true}
  };

  res.send(JSON.stringify(result));
}

exports.process_notice_add = function(req, res){
  var result={
    "resultinfo": {"success": true}
  };

  res.send(JSON.stringify(result));
}

exports.process_notice_delete = function(req, res){
  var result={
    "resultinfo": {"success": true}
  };

  res.send(JSON.stringify(result));
}


// ============== DOCUMENT ===================

exports.document_list = function(req, res){
  var result={
    "resultinfo": {
  "success": true
    },
    "workStockInfo": {
        "tsprocess": DATETIME,
        "tslastupdate": DATETIME,
        "prio": SHORT,
        "partition": SHORT,
        "recordkey": {
            "SectionID": SHORT,
            "Inkarnation": SHORT,
            "RecordID": STRING
        },
        "type": SHORT,
        "vwhnr": STRING,
        "scnr": STRING,
        "vdnr": STRING,
        "lock": STRING,
        "valid": STRING,
        "state": SHORT,
        "countnotice": SHORT,
        "recbasketid": STRING,
        "resubdate": DATETIME,
        "myworkbasketid": STRING
    },
    "personList":
    {
        SHORT: {
            "vorname": STRING,
            "nachname": STRING
        }
    },
    "documentList": [
    {
        "vpnr": SHORT,
        "tsdocument": DATETIME,
        "tslastupdate": DATETIME,
        "partition": SHORT,
        "type": SHORT,
        "copy": STRING,
        "schutzklasse": SHORT,
        "lock": STRING,
        "fallcount": SHORT,
        "docsourceid": SHORT,
        "pages": SHORT,
        "countnotice": SHORT,
        "showpdf": {
            "doctype": STRING,
            "objectid": STRING
        },
        "indexlist": [
            {
                "id": STRING,
                "value": STRING
            }
        ]
    }
    ],
    "letterList": [
    {
        "subject": STRING,
        "date": DATETIME,
        "state": SHORT,
        "updusername": STRING,
        "caseNr": SHORT,
        "showpdf": {
            "doctype": STRING,
            "objectid": STRING
        }
    }
    ]
  };

  res.send(JSON.stringify(result));
}

exports.document_edit = function(req, res){
  var result={
    "resultinfo": {
      "success": true
    }
  };

  res.send(JSON.stringify(result));
}

exports.document_history_list = function(req, res){
  var result={
    "resultinfo": {
  "success": true
    },
    "historyList": [
    {
      "date": DATETIME,
      "operation": SHORT,
      "username": STRING,
      "subject": STRING,
      "infotext": STRING
    }
  ]
  };

  res.send(JSON.stringify(result));
}

exports.document_sendung_list = function(req, res){
  var result={
    "resultinfo": {"success": true},
    "stapelid":SHORT,
    "personList":
    {
        SHORT: {
            "vorname": STRING,
            "nachname": STRING
        }
    },
    "documentList": [
    {
        "vpnr": SHORT,
        "tsdocument": DATETIME,
        "tslastupdate": DATETIME,
	      "docseqnr" : SHORT,
        "partition": SHORT,
        "type": SHORT,
        "copy": STRING,
        "schutzklasse": SHORT,
        "lock": STRING,
        "fallcount": SHORT,
        "docsourceid": SHORT,
        "pages": SHORT,
        "countnotice": SHORT,
        "showpdf": {
            "doctype": STRING,
            "objectid": STRING
        },
        "indexlist": [
            {
                "id": STRING,
                "value": STRING
            }
        ]
    }
    ]
  };

  res.send(JSON.stringify(result));
}

exports.document_archive = function(req, res){
  var result={
    "resultinfo": {
  "success": true
    }
  };

  res.send(JSON.stringify(result));
}

exports.document_resubmit = function(req, res){
  var result={
    "resultinfo": {
      "success": true
    }
  };

  res.send(JSON.stringify(result));
}

exports.document_sendback = function(req, res){
  var result={
    "resultinfo": {
      "success": true
    }
  };

  res.send(JSON.stringify(result));
}

exports.document_split = function(req, res){
  var result={
    "resultinfo": {
      "success": true
    }
  };

  res.send(JSON.stringify(result));
}

exports.document_forward = function(req, res){
  var result={
    "resultinfo": {
      "success": true
    }
  };

  res.send(JSON.stringify(result));
}

exports.document_notice_edit = function(req, res){
  var result={
    "resultinfo": {
      "success": true
    }
  };

  res.send(JSON.stringify(result));
}

exports.document_notice_invalidate = function(req, res){
  var result={
    "resultinfo": {
      "success": true
    }
  };

  res.send(JSON.stringify(result));
}

exports.document_notice_add = function(req, res){
  var result={
    "resultinfo": {
      "success": true
    }
  };

  res.send(JSON.stringify(result));
}

exports.document_notice_delete = function(req, res){
  var result={
    "resultinfo": {
      "success": true
    }
  };

  res.send(JSON.stringify(result));
}