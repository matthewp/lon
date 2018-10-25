const assert = require('assert');
const { type } = require('../index.js');

describe('Type.get()', () => {
  it('Type.get(id) works', () => {
    const Person = class extends type('person') {
      static get key() {
        return 'id';
      }
    }

    let params = Person.get(14).params();

    assert.deepStrictEqual(params, {
      TableName: 'person',
      Key: {
        id: {
          N: '14'
        }
      }
    });
  });

  it('Type.get(obj) works', () => {
    const Person = class extends type('person') {}

    let params = Person.get({ id: 27 }).params();

    assert.deepStrictEqual(params, {
      TableName: 'person',
      Key: {
        id: {
          N: '27'
        }
      }
    });
  });

  it('Type.get(key, val, key2, val2) works', () => {
    const Person = class extends type('person') {}

    debugger;

    let params = Person.get('org', 'my-org', 'id', 33).params();

    assert.deepStrictEqual(params, {
      TableName: 'person',
      Key: {
        org: {
          S: 'my-org'
        },
        id: {
          N: '33'
        }
      }
    });
  });
});