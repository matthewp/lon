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
    let previousExprCount = this._expr.length;

    if(!previousExprCount) {
      this._expr.push(['SET', nameAlias, '=', valueAlias]);
    } else {
      this._expr.push([nameAlias, '=', valueAlias]);
    }
    
    return this;
  }

  buildUpdateExpression() {
    return this._expr.map(arr => arr.join(' ')).join(', ');
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

  values() {
    return this._attribute.values();
  }
}

module.exports = Update;