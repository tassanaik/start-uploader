var AWS = require('aws-sdk');
var fs = require('fs');
var constant = require('./constant.js');

var s3Server = new AWS.S3({ 'accessKeyId' : constant.accessKeyId, 'secretAccessKey' : constant.secretKey });
module.exports = {
  upload : function(filename, file, callback){
    fs.readFile(file.path, function (err, data) {
      if(err) console.log(err);
      var base64data = new Buffer(data, 'binary');
      var params = {
        Bucket: constant.bucketName,
        Key: filename,
        Body: base64data,
        ACL: 'public-read'
      }
      s3Server.putObject(params, function (resp) {
        callback("SUCCESS");
      });
    });
  },

  readFile : function(key, callback){
    var params = {
      'Bucket' : constant.bucketName,
      'Key' : key
    }
    s3Server.getObject(params, function(err, data){
      if(err){
        console.log(err);
        return;
      }
      callback( data );
    });

  }
}
