const fetch = require('isomorphic-unfetch');
const get = require('lodash/get');
const moment = require('moment');

const TextSection = require('../../../blocks/text-section.block.js');
const ButtonGroup = require('../../../blocks/button-group.block.js');
const client = require('../../../utils/mongo-client');
const slackResponse = require('../../../utils/slack-response');
const findCarpoolById = require('../../../utils/find-carpool-by-id');

const actionIds = {
  SELECT_DEPARTING_DATE: 'select-departing-date',
  SELECT_DEPARTING_TIME: 'select-departing-time',
  SELECT_RETURNING_DATE: 'select-returning-date',
  SELECT_RETURNING_TIME: 'select-returning-time',
  UPDATE_DEPARTING_DATE: 'update-departing-date',
  UPDATE_DEPARTING_TIME: 'update-departing-time',
  UPDATE_RETURNING_DATE: 'update-returning-date',
  UPDATE_RETURNING_TIME: 'update-returning-time',
  SUBMIT_UPDATE: 'submit-update',
  ADD_PASSENGER: 'add-passenger',
  REMOVE_PASSENGER: 'remove-passenger',
  CLOSE_LIST: 'close-list'
};

client.connect(process.env.MONGO_URI);

module.exports = async (req, res) => {
  const payload = JSON.parse(req.body.payload);
  const token = payload.token;
  const action = get(payload, 'actions[0]', {});
  const responseUrl = payload.response_url;
  const userId = payload.user.id;

  try {
    await handleAction({
      action,
      userId,
      responseUrl,
      token
    });

    res.status(200).send();
  } catch (err) {
    console.log(err);
    res.status(500).send();
  }
};

const handleAction = async ({ action, userId, responseUrl, token }) => {
  const { action_id } = action;
  const [actionType, carpoolId, channel] = action_id.split(":");

  const carpool = await findCarpoolById(carpoolId);

  if (!carpool && actionType !== actionIds.CLOSE_LIST) {
    return handleResponse({
      responseUrl,
      body: JSON.stringify(slackResponse({
        replaceOriginal: 'true',
        responseType: channel ? 'ephemeral' : 'in_channel',
        blocks: [
          new TextSection({
            text: 'This carpool has been deleted by its creator. :dizzy_face:'
          }),
          new ButtonGroup({
            id: 'close',
            buttons: [
              {
                text: 'Dismiss',
                actionId: `close-list`,
              }
            ]
          })
        ]
      }))
    });
  }

  const { _id, passengers } = carpool || {};

  let updatedCarpool, newPassengers, departingDate, departingTime, returningDate, returningTime;
  
  switch (actionType) {
    case actionIds.SELECT_DEPARTING_DATE:
      departingDate = moment(get(action, 'selected_date')).toISOString();

      updatedCarpool = await updateCarpool({ _id, update: {
        departingDate
      }});

      if (isCarpoolComplete(updatedCarpool)) {
        return handleResponse({
          responseUrl,
          body: JSON.stringify(slackResponse({
            replaceOriginal: 'true',
            responseType: 'in_channel',
            blocks: carpoolBlocks(updatedCarpool)
          }))
        });
      }
    case actionIds.SELECT_DEPARTING_TIME:
      departingTime = get(action, 'selected_option.value');
      
      updatedCarpool = await updateCarpool({ _id, update: {
        departingTime
      }});

      if (isCarpoolComplete(updatedCarpool)) {
        return handleResponse({
          responseUrl,
          body: JSON.stringify(slackResponse({
            replaceOriginal: 'true',
            responseType: 'in_channel',
            blocks: carpoolBlocks(updatedCarpool)
          }))
        });
      }
      case actionIds.SELECT_RETURNING_DATE:
        returningDate = moment(get(action, 'selected_date')).toISOString();
  
        updatedCarpool = await updateCarpool({ _id, update: {
          returningDate
        }});
  
        if (isCarpoolComplete(updatedCarpool)) {
          return handleResponse({
            responseUrl,
            body: JSON.stringify(slackResponse({
              replaceOriginal: 'true',
              responseType: 'in_channel',
              blocks: carpoolBlocks(updatedCarpool)
            }))
          });
        }
      case actionIds.SELECT_RETURNING_TIME:
        returningTime = get(action, 'selected_option.value');
        
        updatedCarpool = await updateCarpool({ _id, update: {
          returningTime
        }});
  
        if (isCarpoolComplete(updatedCarpool)) {
          return handleResponse({
            responseUrl,
            body: JSON.stringify(slackResponse({
              replaceOriginal: 'true',
              responseType: 'in_channel',
              blocks: carpoolBlocks(updatedCarpool)
            }))
          });
        }
  
    case actionIds.UPDATE_DEPARTING_TIME:
      departingTime = get(action, 'selected_option.value');
    
      return updateCarpool({ _id, update: {
        departingTime
      }});
    case actionIds.UPDATE_DEPARTING_DATE:
      departingDate = moment(get(action, 'selected_date')).toISOString();

      return await updateCarpool({ _id, update: {
        departingDate
      }});
      case actionIds.UPDATE_RETURNING_TIME:
        returningTime = get(action, 'selected_option.value');
      
        return updateCarpool({ _id, update: {
          returningTime
        }});
      case actionIds.UPDATE_RETURNING_DATE:
        returningDate = moment(get(action, 'selected_date')).toISOString();
  
        return await updateCarpool({ _id, update: {
          returningDate
        }});
    case actionIds.SUBMIT_UPDATE:
      handleResponse({
        responseUrl,
        body: JSON.stringify({ delete_original: 'true' })
      });

      return handleResponse({
        body: JSON.stringify({
          as_user: false,
          text: 'update',
          channel,
          blocks: carpoolBlocks(carpool, { isUpdate: true })
        })
      });
    case actionIds.CLOSE_LIST:
      return handleResponse({
        responseUrl,
        body: JSON.stringify({ delete_original: 'true' })
      });
    case actionIds.ADD_PASSENGER:
      newPassengers = !passengers.includes(userId) ? [...passengers, userId] : passengers;

      updatedCarpool = await updateCarpool({ _id, update: {
        passengers: newPassengers
      }});

      if (channel) {
        return handleResponse({
          body: JSON.stringify({
            as_user: false,
            text: 'update',
            channel,
            blocks: carpoolBlocks(updatedCarpool, { isUpdate: true })
          })
        });
      }

      return handleResponse({
        responseUrl,
        body: JSON.stringify({
          replace_original: 'true',
          response_type: 'in_channel',
          blocks: carpoolBlocks(updatedCarpool, { isUpdate: true })
        })
      });
    case actionIds.REMOVE_PASSENGER:
      newPassengers = passengers.filter(id => id !== userId);

      updatedCarpool = await updateCarpool({ _id, update: {
        passengers: newPassengers
      }});

      if (channel) {  
        return handleResponse({
          body: JSON.stringify({
            as_user: false,
            text: 'update',
            channel,
            blocks: carpoolBlocks(updatedCarpool, { isUpdate: true })
          })
        });
      }

      return handleResponse({
        responseUrl,
        body: JSON.stringify({
          replace_original: 'true',
          response_type: 'in_channel',
          blocks: carpoolBlocks(updatedCarpool, { isUpdate: true })
        })
      });
  }
};

const isCarpoolComplete = (carpool) => get(carpool, 'departingTime') && get(carpool, 'departingDate');

const handleResponse = ({ responseUrl = 'https://slack.com/api/chat.postMessage', body }) => {
  return fetch(responseUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.SLACK_TOKEN}`
    },
    body
  }).then(response => response.json());
};

const passengerBlocks = (passengers) => {
  return passengers.map(passenger => new TextSection({
    text: `<@${passenger}> joined this carpool. :seedling: :sparkles:`
  }));
};

const carpoolBlocks = (carpool, options = { isUpdate: false }) => {
  const { isUpdate } = options;

  const {
    _id,
    userId,
    origin,
    destination,
    departingDate,
    departingTime,
    returningDate,
    returningTime,
    passengers = [],
    seatsAvailable
  } = carpool;

  const formattedDate = moment(departingDate).format('dddd, MMM Do');

  const intro = isUpdate ? '*UPDATE:*' : '<!here>';

  const blocks = [
    new TextSection({
      text: `${intro} :car: beep beep! <@${userId}> has a carpool leaving from *${origin}* to *${destination}* on *${formattedDate}* at *${departingTime}* and returning on ${returningDate} at ${returningTime}. There are *${seatsAvailable - passengers.length}* seats available.`
    }),
    new ButtonGroup({
      id: `toggle-passenger`,
      buttons: [
        { text: 'Hop in', actionId: `add-passenger:${_id}`, value: "true" },
        { text: 'Hop out', actionId: `remove-passenger:${_id}`, value: "false" }
      ]
    })
  ];

  return passengers.length 
    ? [blocks[0], ...passengerBlocks(passengers), blocks[1]]
    : blocks;
};

const updateCarpool = async ({ _id, update }) => {
   return client.update({
    id: _id,
    type: 'Carpool',
    input: update
  });
};
