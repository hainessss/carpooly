const getLastCarpool = require('../../utils/get-last-carpool');
const slackResponse = require('../../utils/slack-response');
const TextSection = require('../../blocks/text-section.block.js');
const DatePicker = require('../../blocks/date-picker.block.js');
const TimePicker = require('../../blocks/time-picker.block.js');
const ImageBlock = require('../../blocks/image.block.js');
const ButtonGroup = require('../../blocks/button-group.block.js');

module.exports = async ({ body }) => {
  const { user_id } = body;

  const carpool = await getLastCarpool(user_id);

  if (!carpool) {
    return slackResponse({
      blocks: [
        new TextSection({
          text: 'You have no carpools to delete.'
        }),
        new ImageBlock({
          url: 'https://media.giphy.com/media/Vd8kwqv2aq6kUKpl70/giphy.gif',
          title: 'No bananas.'
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
    })
  }

  const { origin, destination, channel, _id } = carpool;

  return slackResponse({
    blocks: [
      new TextSection({
        text: `Edit the details of your carpool leaving from ${origin} to ${destination}.`
      }),
      new DatePicker({
        actionId: `update-date:${_id}`
      }),
      new TimePicker({
        actionId: `update-time:${_id}`
      }),
      new ButtonGroup({
        id: 'sumbit',
        buttons: [
          {
            text: 'Submit',
            actionId: `submit-update:${_id}:${channel}`,
            style: 'primary'
          }
        ]
      })
    ]
  });
};
