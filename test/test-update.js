
const assert = require('assert');
const { Update } = require('../index.js');

describe('Update', () => {
  it('Basics works', () => {
    let params = new Update('table1')
      .key('id', 15)
      .set('name', 'Wilbur')
      .params();

    assert.deepStrictEqual(params, {
      TableName: 'table1',
      Key: {
        id: {
          N: '15'
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

  it('Can inspect update values', () => {
    let upd = new Update('mytable').key('id', 15)
      .set('name', 'Wilbur');

    assert.equal(upd.values().get('name'), 'Wilbur');
  });
});