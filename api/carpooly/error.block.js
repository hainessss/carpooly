const get = require('lodash/get');

module.exports = ({ error = {} }) => {
  const message = get(error, 'message', 'unkown problem');

  return {
    "blocks": [
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": `*Error:* It seems you did not follow Capooly's instructions.`
        }
      },
      {
        "type": "context",
        "elements": [
          {
            "type": "mrkdwn",
            "text": `>_Error Message: ${message}_`
          }
        ]
      },
      {
        "type": "image",
        "title": {
          "type": "plain_text",
          "text": "That is why you fail",
          "emoji": true
        },
        "image_url": "https://media.giphy.com/media/108GZES8iG0myc/giphy.gif",
        "alt_text": "That is why you fail."
      }
    ]
  }
};
