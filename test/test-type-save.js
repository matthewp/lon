const assert = require('assert');
const { type } = require('../index.js');

describe('Type.protoype.save()', () => {
  it('Basics works', () => {
    const Person = type('person');
    let me = new Person();
    me.id = 15;
    me.name = 'Matthew';

    let params = me.save().params();

    assert.deepStrictEqual(params, {
      TableName: 'person',
      Item: {
        id: {
          N: '15'
        },
        name: {
          S: 'Matthew'
        }
      }
    });
  });
});