const fetch = require('isomorphic-unfetch');
const get = require('lodash/get');
const moment = require('moment');

const carpoolBlock = require('./carpool.block.js');
const client = require('../../../mongo-client');
const getLastCarpool = require('../../../utils/getLastCarpool');

const actionIds = {
  SET_DATE: 'select-date',
  SET_TIME: 'select-time',
  TOGGLE_PASSENGER: 'toggle-passenger'
};

client.connect(process.env.MONGO_URI);

module.exports = async (req, res) => {
  const payload = JSON.parse(req.body.payload);
  const action = get(payload, 'actions[0]', {});
  const responseUrl = payload.response_url;
  const userId = payload.user.id;

  try {
    const response = await handleAction({
      action,
      userId,
      responseUrl
    });

    res.status(200).send(response);
  } catch (err) {
    console.log(err);
    res.status(500).send();
  }
};

const handleAction = async ({ action, userId, responseUrl }) => {
  const { _id, passengers } = await getLastCarpool(userId);

  const actionId = action.action_id;
  let updatedCarpool;

  switch (actionId) {
    case actionIds.SET_DATE:
      const departingDate = moment(get(action, 'selected_date')).toISOString();

      updatedCarpool = await updateCarpool({ _id, update: {
        departingDate
      }});

      return respondIfCarpoolComplete({ updatedCarpool, userId, responseUrl });
    case actionIds.SET_TIME:
      const departingTime = get(action, 'selected_option.value');
      
      updatedCarpool = await updateCarpool({ _id, update: {
        departingTime
      }});

      return respondIfCarpoolComplete({ updatedCarpool, userId, responseUrl });
    case actionIds.TOGGLE_PASSENGER:
      const hoppingOn = get(action, 'value') === "true";
      const newPassengers = hoppingOn 
        ? [...passengers, userId]
        : passengers.filter(u => u !== userId);

      updatedCarpool = await updateCarpool({ _id, update: {
        passengers: newPassengers
      }});
      
      return respondIfCarpoolComplete({ updatedCarpool, userId, responseUrl });
  }
};

const respondIfCarpoolComplete = async ({ updatedCarpool, userId, responseUrl }) => {
  if (get(updatedCarpool, 'departingTime') && get(updatedCarpool, 'departingDate')) {
    console.log('responding')
    await fetch(responseUrl, {
      method: 'POST',
      body: JSON.stringify(carpoolBlock({ carpool: updatedCarpool, userId }))
    }).then(result => result.json()).then(res => console.log(res)).catch(err => console.log('slack err', err))
  }

  return { "success": "true" };
};

const updateCarpool = async ({ _id, update }) => {
   return client.update({
    id: _id,
    type: 'Carpool',
    input: update
  });
};
