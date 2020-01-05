const moment = require('moment');

module.exports = ({ origin, destination }) => {
  const timeOptions = new Array(23).fill(null).map((value, index) => ({
    "text": {
      "type": "plain_text",
      "text": moment().hour(index).minute(0).format('h:mm a'),
      "emoji": true
    },
    "value": moment().hour(index).minute(0).format('h:mm a')
  }));

  return {
    "replace_orginal": true,
    "blocks": [
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": `Enter the details of your carpool from *${origin}* to *${destination}*.`
        }
      },
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": "Pick a departure date."
        },
        "accessory": {
          "type": "datepicker",
          "action_id": "select-date",
          "placeholder": {
            "type": "plain_text",
            "text": "Select a date",
            "emoji": true
          }
        }
      },
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": "Pick an item from the dropdown list"
        },
        "accessory": {
          "type": "static_select",
          "action_id": "select-time",
          "placeholder": {
            "type": "plain_text",
            "text": "Select an item",
            "emoji": true
          },
          "options": timeOptions
        }
      }
    ]
  }
};
