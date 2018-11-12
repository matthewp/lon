const assert = require('assert');
const { Query } = require('../index.js');

describe('Query', () => {
  it('Basics works', () => {
    let params = new Query('people')
      .where('last = ?', 'Phillips')
      .where('age > ?', 12)
      .select(['name', 'age'])
      .params();

    assert.deepStrictEqual(params, {
      TableName: 'people',
      ScanIndexForward: true,
      ProjectionExpression: '#n, #a',
      KeyConditionExpression: '#l = :l AND #a > :a',
      ExpressionAttributeNames: {
        '#l': 'last',
        '#a': 'age',
        '#n': 'name'
      },
      ExpressionAttributeValues: {
        ':l': {
          S: 'Phillips'
        },
        ':a': {
          N: "12"
        }
      }
    });
  });

  it('Selecting fields is optional', () => {
    let params = new Query('scores')
    .where('id = ?', 14)
    .params();

    assert.deepStrictEqual(params, {
      TableName: 'scores',
      ScanIndexForward: true,
      KeyConditionExpression: '#i = :i',
      ExpressionAttributeNames: {
        '#i': 'id'
      },
      ExpressionAttributeValues: {
        ':i': {
          N: '14'
        }
      }
    });
  });

  it('Can provide an index', () => {
    let params = new Query('activity')
    .index('Topic-index')
    .where('id = ?', 14)
    .params();

    assert.deepStrictEqual(params, {
      TableName: 'activity',
      IndexName: 'Topic-index',
      ScanIndexForward: true,
      KeyConditionExpression: '#i = :i',
      ExpressionAttributeNames: {
        '#i': 'id'
      },
      ExpressionAttributeValues: {
        ':i': {
          N: '14'
        }
      }
    });
  });
});