const assert = require('assert');
const Query = require('./query.js');

describe('Query', () => {
  it('Basics works', () => {
    let params = new Query('people')
      .where('last = ?', 'Phillips')
      .where('age > ?', 12)
      .select(['name', 'age'])
      .params();

    assert.deepStrictEqual(params, {
      TableName: 'people',
      ScanIndexForward: false,
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
});