const { wrap } = require('./wrap.js');

class Attributes {
  constructor() {
    this._names = new Set();
    this._values = new Set();
    this._namesMap = Object.create(Object.prototype);
    this._valueMap = Object.create(Object.prototype);
  }

  add(name) {
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

  addValue(name, value) {
    let alias = this.add(name);

    let valueAlias = ':' + alias[1];
    this._valueMap[valueAlias] = value;

    return [alias, valueAlias];
  }

  buildExpressionAttributeNames() {
    return this._namesMap;
  }

  buildExpressionAttributeValues() {
    return wrap(this._valueMap);
  }
}

module.exports = Attributes;