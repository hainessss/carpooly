const moment = require('moment');

module.exports = ({ carpool, replaceOriginal = false }) => {
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
          "action_id": "add-passenger",
          "text": {
            "type": "plain_text",
            "text": "Hop in",
            "emoji": true
          },
          "value": "true"
        },
        {
          "type": "button",
          "action_id": "remove-passenger",
          "style": "danger",
          "text": {
            "type": "plain_text",
            "text": "Hop out",
            "emoji": true
          },
          "value": "false"
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

  const response = {
    "response_type": "in_channel",
    "blocks": blocks
  };

  if (replaceOriginal) {
    response["replace_original"] = "true";
  } else {
    response["delete_original"] = "true";
  }

  return response;
};
