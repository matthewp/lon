const Get = require('./get.js');
const Delete = require('./delete.js');
const Put = require('./put.js');
const Update = require('./update.js');
const Query = require('./query.js');

module.exports = function(tableName) {
  function getKey(inst) {
    let keys = inst.constructor.key;
    if(typeof keys === 'undefined') {
      throw new Error('Add a `static get key()` to define the key.');
    }
    if(!Array.isArray(keys)) {
      keys = [keys];
    }
    return keys;
  }

  function getKeyArgs(inst, keys) {
    let keyArgs = [];
    for(let key of keys) {
      keyArgs.push(key);
      keyArgs.push(Reflect.get(inst, key));
    }
    return keyArgs;
  }

  return class {
    static get(...args) {
      let builder = new Get(tableName);

      if(args.length === 1) {
        let ids = args[0];

        if(typeof ids === 'object') {
          let keyArgs = [];
          for(let [key, value] of Object.entries(args[0])) {
            keyArgs.push(key);
            keyArgs.push(value);
          }
    
          builder.key(...keyArgs);
        } else {
          if(typeof this.key === 'undefined') {
            throw new Error('Add a `static get key()` to define the key.');
          }
          let key = this.key;
          builder.key(key, ids);
        }
      } else if(args.length > 1) {
        builder.key(...args);
      } 
        
      return builder;
    }

    static query(conditions) {
      let query = new Query(tableName);
      
      if(conditions) {
        for(let [key, value] of Object.entries(conditions)) {
          query.where(`${key} = ?`, value);
        }
      }

      return query;
    }

    constructor(values = {}) {
      Object.assign(this, values);
    }

    save() {
      return new Put(tableName, this);
    }

    update() {
      let keys = new Set(getKey(this));
      let keyArgs = getKeyArgs(this, keys);

      let update = new Update(tableName);
      update.key(...keyArgs);
      
      let updateCount = 0;
      for(let [name, value] of Object.entries(this)) {
        if(!keys.has(name)) {
          updateCount++;
          update.set(name, value);
        }
      }

      if(updateCount === 0) {
        throw new Error('Cannot perform update. This object has no updatable properties.');
      }

      return update;
    }

    delete() {
      let keys = getKey(this);      
      let keyArgs = getKeyArgs(this, keys);

      let del = new Delete(tableName);
      del.key(...keyArgs);
      return del;
    }
  };
};