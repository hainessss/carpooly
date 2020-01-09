const client = require('../mongo-client');
const get = require('lodash/get');

module.exports = (userId) => {
  return client.get({
    type: 'Carpool',
    query: {
      userId
    },
    paging: {
      limit: 1
    },
    sort: {
      createdAt: -1
    }
  }).then(result => {
    return get(result, '[0]', null);
  }).catch(error => {
    console.log('error', error)
  });
};
