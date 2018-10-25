const assert = require('assert');
const { type } = require('../index.js');

describe('Type.query()', () => {
  it('Basics works', () => {
    const User = type('users');

    let params = User.query({ id: 44, isAdmin: true }).params();

    assert.deepStrictEqual(params, {
      TableName: 'users',
      ScanIndexForward: true,
      KeyConditionExpression: '#i = :i AND #j = :j',
      ExpressionAttributeNames: {
        '#i': 'id',
        '#j': 'isAdmin'
      },
      ExpressionAttributeValues: {
        ':i': {
          N: '44'
        },
        ':j': {
          BOOL: true
        }
      }
    });
  });
});