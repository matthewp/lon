const Attributes = require('./attributes.js');

function trim(str) {
  return str.trim();
}

class Query {
  constructor(tableName) {
    this._tableName = tableName;
    this._indexName = null;
    this._scanIndexForward = true;
    this._conditions = [];
    this._projections = new Set();
    this._attributes = new Attributes();
  }

  where(condition, value) {
    let parts = condition.split(/(=|<|>|<=|>=)/).map(trim);

    let name = parts[0];

    let [nameAlias, valueAlias] = this._attributes.addValue(name, value);
    let operator = parts[1];

    this._conditions.push([nameAlias, operator, valueAlias]);

    return this;
  }
  
  select(keys) {
    for(let name of keys) {
      let alias = this._attributes.add(name);
      this._projections.add(alias);
    }

    return this;
  }

  desc() {
    this._scanIndexForward = false;
    return this;
  }

  index(name) {
    this._indexName = name;
    return this;
  }

  get keyConditionExpression() {
    return this._conditions.map(cond => cond.join(' ')).join(' AND ');
  }

  get projectionExpression() {
    let str = '';
    for(let alias of this._projections) {
      str += str.length ? `, ${alias}` : alias;
    }
    return str;
  }

  params() {
    let params = {
      TableName: this._tableName,
      ScanIndexForward: this._scanIndexForward,
      KeyConditionExpression: this.keyConditionExpression,
      ExpressionAttributeNames: this._attributes.buildExpressionAttributeNames(),
      ExpressionAttributeValues: this._attributes.buildExpressionAttributeValues()
    };

    if(this._indexName) {
      params.IndexName = this._indexName;
    }

    let projectionExpression = this.projectionExpression;
    if(this.projectionExpression.length > 0) {
      params.ProjectionExpression = projectionExpression;
    }

    return params;
  }
}

module.exports = Query;