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

  it('Throws when there are no properties to be updated', () => {
    const Person = class extends type('person') {
      static get key() { return 'id'; }
    };

    let me = new Person({ id: 11 });

    let threw = false;
    try {
      me.update();
    } catch(err) {
      threw = true;
    }

    assert.ok(threw, 'Threw because there are no props to update');
  });
});