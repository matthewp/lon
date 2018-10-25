const { wrap } = require('./wrap.js');

class KeyParam {
  constructor(tableName) {
    this.tableName = tableName;
    this._key = null;
  }

  key(...args) {
    if(args.length === 1) {
      this._key = args[0];
    } else {
      this._key = {};
      let len = args.length;
      let i = 0;
      do {
        this._key[args[i]] = args[++i];
        i++;
      } while(i < len);
    }
    return this;
  }

  _buildKey() {
    return wrap(this._key);
  }

  params() {
    return {
      TableName: this.tableName,
      Key: this._buildKey()
    };
  }
}

module.exports = KeyParam;