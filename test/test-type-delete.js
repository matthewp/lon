const assert = require('assert');
const { type } = require('../index.js');

describe('Type.protoype.delete()', () => {
  it('Basics works', () => {
    const Person = class extends type('person') {
      static get key() {
        return 'id';
      }
    }

    let me = new Person();
    me.id = 15;

    let params = me.delete().params();

    assert.deepStrictEqual(params, {
      TableName: 'person',
      Key: {
        id: {
          N: '15'
        }
      }
    });
  });
});