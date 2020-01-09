const getLastCarpool = require('../../utils/get-last-carpool');
const slackResponse = require('../../utils/slack-response');
const TextSection = require('../../blocks/text-section.block.js');
const ImageBlock = require('../../blocks/image.block.js');
const ButtonGroup = require('../../blocks/button-group.block.js');
const client = require('../../utils/mongo-client');

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

  const { _id, origin, destination } = carpool;

  await client.deleteOne({
    type: 'Carpool',
    query: {
      _id
    }
  });

  return slackResponse({
    blocks: [
      new TextSection({
        text: `Your carpool leaving from *${origin}* to *${destination}* has been deleted.`
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
  });
};
