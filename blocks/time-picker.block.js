const moment = require('moment');

module.exports = function TimePicker({ actionId, promptText }) {
  const timeOptions = new Array(23).fill(null).map((value, index) => ({
    "text": {
      "type": "plain_text",
      "text": moment().hour(index).minute(0).format('h:mm a'),
      "emoji": true
    },
    "value": moment().hour(index).minute(0).format('h:mm a')
  }));

  return {
    type: "section",
    text: {
      type: "mrkdwn",
      text: promptText
    },
    accessory: {
      type: "static_select",
      action_id: actionId,
      placeholder: {
        type: "plain_text",
        text: "Select an item",
        emoji: true
      },
      options: timeOptions
    }
  };
};