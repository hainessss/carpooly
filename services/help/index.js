const Help = require('../../blocks/Help.block');
const slackResponse = require('../../utils/slack-response');

module.exports = () => {
  const commands = [
    {
      command: '_/carpooly_ [origin] [destination] [seats available]',
      description: '*Creates* a new carpooly with the specified details and posts it to the channel you called carpooly in.'
    },
    {
      command: '_/carpooly_ edit',
      description: '*Edits* the departure date and time of your most recently posted carpool. Re-posts to the channel you created that carpool in.'
    },
    {
      command: '_/carpooly_ list',
      description: '*Lists* the carpools scheduled in the next 7 days. Re-posts to the original channel if you join a carpool.'
    },
    {
      command: '_/carpooly_ delete',
      description: '*Deletes* your most recently posted carpool.'
    }
  ];

  return slackResponse({
    blocks: [
      new Help({ commands })
    ]
  });
};
