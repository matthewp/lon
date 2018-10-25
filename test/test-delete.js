const assert = require('assert');
const { Delete } = require('../index.js');

describe('Delete', () => {
  it('Basics works', () => {
    let params = new Delete('table').key('name', 'Matthew').params();

    assert.deepStrictEqual(params, {
      TableName: 'table',
      Key: {
        name: {
          S: 'Matthew'
        }
      }
    });
  });
})