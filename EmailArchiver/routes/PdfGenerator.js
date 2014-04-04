var phantom = require('phantom');
var fs = require('fs');
var main = require("./main");
var date = new Date();

exports.renderPDF = function(req, res){

  // SET HEADER OF PAGE
//  res.writeHead(200, {"Content-Type": "application/pdf", "filename": "PDF_"+req.session.fileName});
//  res.set({'Content-Type': 'application/pdf'});
  res.setHeader('Content-disposition', 'attachment; filename=' + req.session.fileName.replace('.eml','')+'.pdf');

  var resultEml = main.creatEmlObject(req, res, req.session.oEml);
  var pathFilePdf = './public/images/pdf/'+date.toDateString()+'_'+date.getHours()+'_'+date.getMinutes()+'_'+date.getSeconds()+'_'+date.getMilliseconds()+'_EmailArchiver.pdf';
  var pathFileHtml = './public/html/'+date.toDateString()+'_'+date.getHours()+'_'+date.getMinutes()+'_'+date.getSeconds()+'_'+date.getMilliseconds()+'_EmailArchiver.html';
  var pathFileHtmlGet = pathFileHtml.replace("./public","");

  //=== READ PDF IN MAIN CREATED
  try{
    fs.readFile(req.session.pathFDF, function(err, data){
      if(!err){
        res.write(data);
        res.end();
      }
      else{
        console.log('in err read file: '+err);
      }
    });
  }
  catch(e){
    console.log("not req.session.pathFDF");
  }


//  res.render('HTMLTEMPLATES/'+req.session.tempId, {eml : resultEml, ObjectJS: req.session.ObjectJS, eml2: resultEml}, function(err, body){ //== get HTML content of jade pdf
//    var freeport = Math.floor((Math.random()*10000)+1);
//    phantom.create({'port': freeport},function(ph){
//      ph.createPage(function(page){
//
//        // CONFIG PDF PAGE
//        page.set('viewportSize', { width: 1600});
//        page.set('paperSize', {format: 'A4'});
//        page.set('zoomFactor', 1);
//
//        // WRITE EMML TO HTML
//        fs.writeFileSync(pathFileHtml, body);
//        // RENDER PDF
//        page.open('http://localhost:3300'+pathFileHtmlGet, function (status) {
//          page.render(pathFilePdf, function(){
//            ph.exit();
//            fs.unlinkSync(pathFileHtml);
//            // RESPONSE DATA OF PDF
//            fs.readFile(pathFilePdf, function(err, data){
//              if(!err){
//                res.write(data);
//                fs.unlinkSync(pathFilePdf);
//                res.end();
//              }
//              else{
//                console.log('in err read file: '+err);
//              }
//            });
//          });
//        });
//      });
//    });
//  });
}