const dynamoAttr = require('dynamodb-data-types').AttributeValue;

function wrap(obj, wrapOptions) {
  return dynamoAttr.wrap(obj, wrapOptions);
}

function unwrap(obj) {
  return dynamoAttr.unwrap(obj);
}

exports.wrap = wrap;
exports.unwrap = unwrap;