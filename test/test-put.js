const assert = require('assert');
const { Put } = require('../index.js');

describe('Put', () => {
  it('Passing the item into the constructor works', () => {
    let item = { id: 12, name: 'Matthew' };
    let params = new Put('table2', item).params();
    assert.deepStrictEqual(params, {
      TableName: 'table2',
      Item: {
        id: {
          N: '12'
        },
        name: {
          S: 'Matthew'
        }
      }
    });
  });

  it('Passing the item through .item() works too', () => {
    let item = { id: 12, name: 'Matthew' };
    let params = new Put('table2').item(item).params();
    assert.deepStrictEqual(params, {
      TableName: 'table2',
      Item: {
        id: {
          N: '12'
        },
        name: {
          S: 'Matthew'
        }
      }
    });
  });
})