const { wrap } = require('./wrap.js');

function mapToObj(map) {
  let obj = {};
  for(let [key, value] of map) {
    obj[key] = value;
  }
  return obj;
}

class Attributes {
  constructor() {
    this._names = new Set();
    this._values = new Set();
    this._namesMap = new Map();
    this._valuesMap = new Map();
    this._valuePairs = new Map();
  }

  add(name) {
    let char = name[0];
    let set = this._names;
    let map = this._namesMap;
    let cont = set.has(char);

    do {
      let alias = '#' + char;
      if(!map.has(alias) || map.get(alias) === name) {
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
    this._namesMap.set(alias, name);

    return alias;
  }

  addValue(name, value) {
    let alias = this.add(name);

    let valueAlias = ':' + alias[1];
    this._valuesMap.set(valueAlias, value);
    this._valuePairs.set(name, value);

    return [alias, valueAlias];
  }

  values() {
    return new Map(this._valuePairs);
  }

  buildExpressionAttributeNames() {
    return mapToObj(this._namesMap);
  }

  buildExpressionAttributeValues() {
    return wrap(mapToObj(this._valuesMap));
  }
}

module.exports = Attributes;