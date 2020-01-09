const moment = require('moment');

const client = require('../mongo-client');

module.exports = () => {
  return client.get({
    type: 'Carpool',
    query: {
      departingDate: { 
        $gte: moment().toISOString(),
        $lte: moment().add(7, 'days').toISOString()
      }
    },
    sort: {
      createdAt: -1
    }
  });
};
