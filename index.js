const express = require('express');
const formidable = require('formidable');
var s3Server = require('./services/s3.service.js');

const app = express();

const serverPort = 8000

app.get('/', function(request, response){
  response.send("Hello");
});

app.get('/images', function(req, res){
  s3Server.readFile('IMG_0852.jpg', function(data){
    var _length = data.Body.length;
    res.writeHead(200, {
      'Content-Type': 'image/jpeg',
      'Content-Length': _length
    });
    res.end(new Buffer(data.Body, 'binary'));
  });
  //response.send("Hello");
});


app.post('/uploader', function(req, res){
  var form = new formidable.IncomingForm();
  form.parse(req, function(err, fields, files) {
    var result = s3Server.upload(files.fs.name, files.fs, function(resultCode){
        res.send(result);
    })
  });
});

app.listen(serverPort, function(){
  console.log("start on port : "+serverPort);
});
