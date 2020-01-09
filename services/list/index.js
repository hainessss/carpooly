const moment = require('moment');

const getUpcomingCarpools = require('../../utils/get-upcoming-carpools');
const TextSection = require('../../blocks/text-section.block.js');
const ButtonGroup = require('../../blocks/button-group.block.js');
const ImageBlock = require('../../blocks/image.block.js');
const slackResponse = require('../../utils/slack-response');

module.exports = async () => {
  const carpools = await getUpcomingCarpools();

  if (!carpools.length) {
    return slackResponse({
      blocks: [
        new TextSection({
          text: 'Oh no, there are no upcoming carpools :face_vomiting:.'
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
    });
  }

  const carpoolBlocks = carpools.map((carpool, index) => {
    const {
      _id,
      userId,
      origin,
      channel,
      destination,
      departingDate,
      departingTime,
      passengers = [],
      seatsAvailable
    } = carpool;

    const formattedDate = moment(departingDate).format('dddd, MMM Do');

    const passengerBlocks = (passengers) => {
      return passengers.map(passenger => new TextSection({
        text: `<@${passenger}> joined this carpool. :seedling: :sparkles:`
      }));
    };

    const blocks = [
      new TextSection({
        text: `*${index + 1}.*  :car: beep beep! <@${userId}> has a carpool leaving from *${origin}* to *${destination}* on *${formattedDate}* at *${departingTime}*. There are *${seatsAvailable - passengers.length}* seats available.`
      }),
      new ButtonGroup({
        id: `toggle-passenger-${index}`,
        buttons: [
          { text: 'Hop in', actionId: `add-passenger:${_id}:${channel}`, value: "true" },
          { text: 'Hop out', actionId: `remove-passenger:${_id}:${channel}`, value: "false" }
        ]
      })
    ];

    return passengers.length 
      ? [blocks[0], ...passengerBlocks(passengers), blocks[1]]
      : blocks;
  });

  return slackResponse({
    blocks: carpoolBlocks.reduce((blocks, carpoolBlock) => {
      return blocks.concat(carpoolBlock);
    }, []).concat([
      new ButtonGroup({
        id: 'close-list-button',
        buttons: [
          {
            text: 'Close List',
            actionId: 'close-list',
            value: 'true',
            style: 'danger'
          }
        ]
      })
    ])
  });
};
