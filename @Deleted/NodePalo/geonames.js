var http=require("http")
	, fs=require('fs'); 
exports.parseLocation = function(countryCode,postalCode,callback){
	//return "1";
	var arrLocations = new Array();
	var file='./cache/geonames/countries.json';
	fs.readFile(file,'utf8',function(err,data){
		if(err){
			console.log(' !!!!!!!!!!!! Error on reading file: countries.json !!!!!!!!!!! '+err);
			return;
		}
		var json_object=JSON.parse(data);
		var validLocation =false;
		for(var i=0;i<json_object.geonames.length;i++){
			if(json_object.geonames[i].countryCode==countryCode){
				countryName=json_object.geonames[i].countryName;
				continentName=json_object.geonames[i].continentName;
				
				validLocation=true;
				break;
			}	
		}
		if(validLocation){
			var admin1='';
			var admin3='';
			var geonamesFile="./cache/geonames/"+countryCode+","+postalCode+".json";
			if (fs.existsSync(geonamesFile)){
				fs.readFile(geonamesFile, 'utf8', function (err, data) {
					if(err){
						console.log(' !!!!!!!!!!!! Error on reading file: countries.json !!!!!!!!!!! '+err);
						return;
					}
					var json=JSON.parse(data);
					admin1=json.postalcodes[0].adminName1;
					admin3=json.postalcodes[0].adminName3;
					arrLocations[arrLocations.length] =continentName;
					arrLocations[arrLocations.length] =countryName;
					arrLocations[arrLocations.length] =admin1;
					arrLocations[arrLocations.length] =admin3;
					arrLocations[arrLocations.length] =countryCode+','+postalCode;
					return callback(arrLocations);
					
				});
			}else{
				http.get("http://api.geonames.org/postalCodeLookupJSON?formatted=true&postalcode="+postalCode+"&country="+countryCode+"&username=thatko&&style=full", function(resp){
					resp.setEncoding('utf8');	
					resp.on('data',function(chunk){	
						var json=JSON.parse(chunk);
						try{
							if (json.postalcodes[0]!=undefined){
								admin1=json.postalcodes[0].adminName1;	
								admin3=json.postalcodes[0].adminName3;
								arrLocations[arrLocations.length] =continentName;
								arrLocations[arrLocations.length] =countryName;
								arrLocations[arrLocations.length] =admin1;
								arrLocations[arrLocations.length] =admin3;
								arrLocations[arrLocations.length] =countryCode+','+postalCode;
								//save to local file								
								fs.writeFile("./cache/geonames/"+countryCode+","+postalCode+".json", chunk, function(err) {
									if(err) {
										console.log(err);
									} else {
										console.log("The file was saved!");
									}
								}); 		
								return callback(arrLocations);
							} else {
								returnUndefinedLocation(countryCode,postalCode, callback);								
							}
						}catch(e){
							returnUndefinedLocation(countryCode,postalCode, callback);								
						}
					});
				})
			}
		}else{
			returnUndefinedLocation(countryCode,postalCode, callback);								
		}
	})
}

function returnUndefinedLocation(countryCode,postalCode, callback){
	var arrLocations=new Array();
	arrLocations[arrLocations.length] = "undefined";
	arrLocations[arrLocations.length] = generateLocationString(countryCode,postalCode);	
	return callback(arrLocations);
}

function generateLocationString(countryCode, postalCode){
	if (countryCode!="" && postalCode!="") return  countryCode+','+postalCode;
	if (countryCode!="" && postalCode=="") return  countryCode;
	if (countryCode=="" && postalCode!="") return  postalCode;
	return "null";
}