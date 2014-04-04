var http=require("http")
	, fs=require('fs');

exports.parseLocation = function(location, callback){
	//return "1";
  var file='./cache/geonames/countries.json';
	var arrLocations = new Array();
  if(location && typeof location == "object" && location["countryCode"] && location["postalCode"]){
    fs.readFile(file,'utf8',function(err,data){
      if(err){
        console.log(' !!!!!!!!!!!! Error on reading file: countries.json !!!!!!!!!!! '+err);
        return;
      }
      var json_object=JSON.parse(data);
      var validLocation =false;
      for(var i=0;i<json_object.geonames.length;i++){
        if(json_object.geonames[i].countryCode==location["countryCode"]){
          countryName=json_object.geonames[i].countryName;
          continentName=json_object.geonames[i].continentName;

          validLocation=true;
          break;
        }
      }
      if(validLocation){
        var admin1='';
        var admin3='';
        var geonamesFile="./cache/geonames/"+location["countryCode"]+","+location["postalCode"]+".json";
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
            arrLocations[arrLocations.length] =location["countryCode"]+','+location["postalCode"];
            return callback(arrLocations);

          });
        }else{
          http.get("http://api.geonames.org/postalCodeLookupJSON?formatted=true&postalcode="+location["postalCode"]+"&country="+location["countryCode"]+"&username=thatko&&style=full", function(resp){
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
                  arrLocations[arrLocations.length] =location["countryCode"]+','+location["postalCode"];
                  //save to local file
                  fs.writeFile("./cache/geonames/"+location["countryCode"]+","+location["postalCode"]+".json", chunk, function(err) {
                    if(err) {
                      console.log(err);
                    } else {
                      console.log("The file was saved!");
                    }
                  });
                  return callback(arrLocations);
                } else {
                  returnUndefinedLocation(location["countryCode"],location["postalCode"], callback);
                }
              }catch(e){
                returnUndefinedLocation(location["countryCode"],location["postalCode"], callback);
              }
            });
          })
        }
      }else{
        returnUndefinedLocation(location["countryCode"],location["postalCode"], callback);
      }
    })
  } else if(typeof location == "string"){
    arrLocations[arrLocations.length] = "undefined";
    arrLocations[arrLocations.length] = location;
    callback(arrLocations);
  } else if(location && typeof location == "object" && ((location["countryCode"] && !location["postalCode"]) || (!location["countryCode"] && location["postalCode"]))){
    arrLocations[arrLocations.length] = "undefined";
    arrLocations[arrLocations.length] = (location["countryCode"]) ? location["countryCode"] : location["postalCode"];
    callback(arrLocations);
  } else {
    arrLocations[arrLocations.length] = "undefined";
    arrLocations[arrLocations.length] = "null";
    callback(arrLocations);
  }
//  (location == undefined || location.toString().trim() == "" || (typeof location == "object" && Object.keys(location).length == 0))
//  else if(Object.keys(location).length > 0 && (Object.keys(location).indexOf("countryCode") < 0 || Object.keys(location).indexOf("postalCode") < 0)){
//    arrLocations[arrLocations.length] = "undefined";
//    callback(arrLocations);
//  }


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