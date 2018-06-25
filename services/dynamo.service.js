const AWS = require('aws-sdk');
var constant = require('./constant.js');
var utils = require('./../utils/utils.js');

var ddb = new AWS.DynamoDB( {'region' : 'ap-southeast-1', 'accessKeyId' : constant.accessKeyId, 'secretAccessKey' : constant.secretKey } );
module.exports = {
    get : function(){
        var params = {
          'TableName' : 'photospaces',
          'FilterExpression' : 'groupName=:g',
          'ExpressionAttributeValues' : {
            ':g' : {S : 'chompoo'}
          }
        }
        ddb.scan(params, function(err, data){
           if(err) console.log(err);
           data.Items.forEach(function(item){
             console.log(item);
           })
        })
    },

    save : function(object){
      this.getSequence().then(function(seqNo){
          object.index = parseInt( seqNo );
          var params = {
            Item : utils.toDynamo( object ),
            ReturnConsumedCapacity: "TOTAL",
            TableName: "secret.cavity"
          };

          ddb.putItem(params, function(err, data) {
            if (err) console.log(err, err.stack); // an error occurred
            else     console.log(data);           // successful response
          });
      });
    },

    getSequence : function(){
        return new Promise(function(resolve, reject){
          var params = {
            'TableName' : 'constant.parameter',
            'Key' : { 'key' : {  S : 'upload.running.num' } }
          }
          ddb.getItem(params, function(err,data){
            if(err){
              console.log(err);
              return;
            }
            var type = data.Item.type.S;
            var current = parseInt( data.Item.val[type] ); //resolve( data.Item.value[type] );
            var updater = {
                'TableName' : 'constant.parameter',
                'Key' : { 'key' : {  S : 'upload.running.num' } },
                'UpdateExpression' : "set val = :val",
                'ExpressionAttributeValues' : { ":val" : { 'N' : ( ++current ).toString() } },
                'ReturnValues' : "UPDATED_NEW"
            };
            ddb.updateItem(updater,function(err, data){
              if(err) console.log(err);
              resolve( current );
            });

          });
        });
    },




/*
      return new Promise((resolve,reject) => {
        var params = {
          'TableName' : 'constant.parameter',
          'Key' : { 'key' : {  S : 'upload.running.num' } }
        }
        ddb.getItem(params, function(err,data){
          if(err){
            console.log(err);
            return;
          }
          var type = data.Item.type.S;
          resolve( data.Item.value[type] );
        });
      });

    }
*/

/*
      var params = {
        'TableName' : 'constant.parameter',
        'Key' : { 'key' : {  S : 'upload.running.num' } }
      }
      ddb.getItem(params, function(err,data){
        if(err){
          console.log(err);
          return;
        }
        var type = data.Item.type.S;
        console.log( data.Item.value[type] );
      });
      console.log("Wait ...");
*/





}
