
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

  it('Multiple sets are separated by a comma', () => {
    let params = new Update('mytable').key('id', 15)
      .set('name', 'Wilbur')
      .set('breed', 'Staffordshire')
      .params();

    assert.deepStrictEqual(params, {
      TableName: 'mytable',
      Key: {
        id: {
          N: '15'
        }
      },
      UpdateExpression: 'SET #n = :n, #b = :b',
      ExpressionAttributeNames: {
        '#n': 'name',
        '#b': 'breed'
      },
      ExpressionAttributeValues: {
        ':n': {
          S: 'Wilbur'
        },
        ':b': {
          S: 'Staffordshire'
        }
      }
    });
  });
});