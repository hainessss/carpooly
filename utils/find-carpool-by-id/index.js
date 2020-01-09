const client = require('../mongo-client');

module.exports = (id) => {
  return client.getOne({
    type: 'Carpool',
    query: {
      _id: id
    }
  });
};
