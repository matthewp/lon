const assert = require('assert');
const { Get } = require('../index.js');

describe('Get', () => {
  it('Basics works', () => {
    let params = new Get('table').key('foo', 35).params();
    assert.deepStrictEqual(params, {
      TableName: 'table',
      Key: {
        foo: {
          N: "35"
        }
      }
    });
  });
})