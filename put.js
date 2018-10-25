const { wrap } = require('./wrap.js');

class Put {
  constructor(tableName, item) {
    this.tableName = tableName;
    this._item = item;
  }

  item(item) {
    this._item = item;
    return this;
  }

  _buildItem() {
    if(!this._item) {
      throw new Error('No item provided');
    }
    return wrap(this._item);
  }

  params() {
    return {
      TableName: this.tableName,
      Item: this._buildItem()
    };
  }
}

module.exports = Put;