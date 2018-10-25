const assert = require('assert');
const { type } = require('../index.js');

describe('Type.prototype.update()', () => {
  it('Basics works', () => {
    const Person = class extends type('person') {
      static get key() {
        return 'id';
      }
    }

    let me = new Person();
    me.id = 23;
    me.name = 'Wilbur';

    let params = me.update().params();

    assert.deepStrictEqual(params, {
      TableName: 'person',
      Key: {
        id: {
          N: '23'
        }
      },
      UpdateExpression: 'SET #n = :n',
      ExpressionAttributeNames: {
        '#n': 'name'
      },
      ExpressionAttributeValues: {
        ':n': {
          S: 'Wilbur'
        }
      }
    });
  });
});