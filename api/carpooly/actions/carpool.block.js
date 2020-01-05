const moment = require('moment');

module.exports = ({ carpool, userId: actionUserId }) => {
  const {
    userId,
    origin,
    destination,
    departingDate,
    departingTime,
    passengers = [],
    seatsAvailable
  } = carpool;

  const formattedDate = moment(departingDate).format('dddd, MMM Do');

  const isInCar = passengers.includes(actionUserId);

  let blocks = [
    {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": `<!channel> :car: beep beep! <@${userId}> started a carpool leaving from *${origin}* to *${destination}* on *${formattedDate}* at *${departingTime}*. There are *${seatsAvailable - passengers.length}* seats available.`
      }
    },
    {
      "type": "actions",
      "block_id": "actions1",
      "elements": [
        {
          "type": "button",
          "action_id": "toggle-passenger",
          "text": {
            "type": "plain_text",
            "text": `${isInCar ? 'Hop out' : 'Hop in'}`,
            "emoji": true
          },
          "value": `${isInCar ? 'false' : 'true'}`
        }
      ]
    }
  ];

  const passengerBlocks = passengers.map(userId => ({
    "type": "section",
    "text": {
      "type": "mrkdwn",
      "text": `<@${userId}> joined this carpool. :seedling: :sparkles:`
    }
  }))

  blocks = passengers.length ? [blocks[0], ...passengerBlocks, blocks[1]] : blocks;

  return {
    "response_type": "in_channel",
    "replace_original": "true",
    "blocks": blocks
  };
};
