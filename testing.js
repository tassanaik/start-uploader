const uuidv4 = require('uuid/v4');
var s3Server = require('./services/s3.service.js');
var dynamo = require('./services/dynamo.service.js');





async function main(){
  console.log("== start ==");
  var now = new Date();

  await dynamo.getSequence().then(function(seqNo){
    var _file = {

      fileId : uuidv4(),
      savedate : now,
      modifydate : now,
      filename : 'IMG_0001.JPG',
      type : 'image/jpeg'
    }
    dynamo.save( _file );


  });

  //console.log( utils.toDynamo(_file) );
}




main();
