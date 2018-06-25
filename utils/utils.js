var dateFormat = require('dateformat');

module.exports = {
  toDynamo : function ( obj ){
    var result = {};
    for (var key in obj) {
      var _item = {};
      if( typeof(obj[key]) ===  'string' ){
        _item = { 'S' : obj[key] }
      } else if( typeof(obj[key]) ===  'number' ){
        _item = { 'N' : obj[key].toString() }
      } else if( typeof(obj[key]) ===  'object' && obj[key] instanceof Date ){
        _item = { 'S' : dateFormat(obj[key], "yyyy-mm-dd HH:MM:ss:l") };
      }
      result[key] = _item;
    }
    return result;
  }
}
