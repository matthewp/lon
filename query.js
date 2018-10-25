const { wrap } = require('./wrap.js');

function trim(str) {
  return str.trim();
}

class Query {
  constructor(tableName) {
    this._tableName = tableName;
    this._scanIndexForward = false;
    this._conditions = [];
    this._names = new Set();
    this._values = new Set();
    this._projections = new Set();
    this._namesMap = Object.create(Object.prototype);
    this._valueMap = Object.create(Object.prototype);
  }

  where(condition, value) {
    let parts = condition.split(/(=|<|>|<=|>=)/).map(trim);

    let name = parts[0];
    let nameAlias = this._determineAlias(name)

    let valueAlias = ':' + nameAlias[1];
    let operator = parts[1];

    this._conditions.push([nameAlias, operator, valueAlias]);
    this._valueMap[valueAlias] = value;

    return this;
  }

  _determineAlias(name) {
    let char = name[0];
    let set = this._names;
    let map = this._namesMap;
    let cont = set.has(char);

    do {
      let alias = '#' + char;
      if(!(alias in map) || map[alias] === name) {
        cont = false;
      } else {
        let code = char.charCodeAt(0);
        let next = code + 1;
    
        if(next > 122) { // z
          next = 97; // a
        }
        char = String.fromCharCode(next);
        alias = '#' + char;
        cont = set.add(alias);
      }
    } while(cont);

    let alias = '#' + char;

    this._names.add(alias);
    this._namesMap[alias] = name;

    return alias;
  }
  
  select(keys) {
    for(let name of keys) {
      let alias = this._determineAlias(name);
      this._projections.add(alias);
    }

    return this;
  }

  get keyConditionExpression() {
    return this._conditions.map(cond => cond.join(' ')).join(' AND ');
  }

  get expressionAttributeNames() {
    return this._namesMap;
  }

  get expressionAttributeValues() {
    return wrap(this._valueMap);
  }

  get projectionExpression() {
    let str = '';
    for(let alias of this._projections) {
      str += str.length ? `, ${alias}` : alias;
    }
    return str;
  }

  params() {
    return {
      TableName: this._tableName,
      ScanIndexForward: this._scanIndexForward,
      ProjectionExpression: this.projectionExpression,
      KeyConditionExpression: this.keyConditionExpression,
      ExpressionAttributeNames: this.expressionAttributeNames,
      ExpressionAttributeValues: this.expressionAttributeValues
    };
  }
}

module.exports = Query;