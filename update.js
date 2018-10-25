const Attributes = require('./attributes.js');
const KeyParams = require('./key-params.js');

class Update extends KeyParams {
  constructor(tableName) {
    super(tableName);
    this._attribute = new Attributes();
    this._expr = [];
  }

  set(name, value) {
    let [nameAlias, valueAlias] = this._attribute.addValue(name, value);
    this._expr.push(['SET', nameAlias, '=', valueAlias]);

    return this;
  }

  buildUpdateExpression() {
    return this._expr.map(arr => arr.join(' ')).join(' AND ');
  }

  params() {
    return {
      TableName: this.tableName,
      Key: this._buildKey(),
      UpdateExpression: this.buildUpdateExpression(),
      ExpressionAttributeNames: this._attribute.buildExpressionAttributeNames(),
      ExpressionAttributeValues: this._attribute.buildExpressionAttributeValues()
    };
  }
}

module.exports = Update;