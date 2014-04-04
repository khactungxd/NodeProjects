var request = require ('request');

for(var i=0;i<10;i++){

	var message = { 
	"supermandant":"EE", 
	"mandant":"ramesh18082012",
	"orgunit": ["organization", "area","hotel","department"],
	"username":"ramesh18082012",
	"location":  { 
		"countryCode": "DE", 
		"postalCode":"70794" 
	} ,
	"entries": [
			{ 
				"activity": {"group":"log", "cmd":"login" }, 
				"responsetime": 0+i,
				"statuscode": 200+i 
			} ,
			{ 
				"activity": {"group":"log", "cmd":"logout "}, 
				"responsetime": 	0+i,
				"statuscode": 300+i 
			} ,
			{
				"activity": {"group":"log", "cmd":"logoff" }, 			
				"responsetime": 0+i,
				"statuscode": 400+i 
			}
		]
	};

//var message ='{ "supermandant":"PE", "mandant":"ramesh18082012","orgunit": ["organization", "area","hotel","department"],"username":"ramesh_18082012 ","location":  { "countryCode": "DE", "postalCode":"70794" } ,"entries": [{ "activity": {"group":"loginout", "cmd":"login" }, "responsetime": 1000,"statuscode": 200} ,{ "activity": {"group":"logout", "cmd":"logout "}, "responsetime": 	1100,"statuscode": 300} ,{"activity": {"group":"loginout", "cmd":"login" }, "responsetime": 1200,"statuscode": 400 }]}';
//var message = '{"firstname":"Jesper","surname":"Aaberg","phone":["555-0100","555-0120"]}';
	var options = {
		'method' : 'POST',
		'uri' : 'http://localhost:3000/',
		'body' : 'message='+JSON.stringify(message),
		'headers' : {
			'content-type' : 'application/x-www-form-urlencoded',
			'User-Agent' : 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.31 (KHTML, like Gecko) Chrome/26.0.1410.64 Safari/537.31 AlexaToolbar/alxg-3.1'
		}
	};
	request(options, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			console.log('body', body)
		} else {
			console.log('body', body);
		}
	})
}
