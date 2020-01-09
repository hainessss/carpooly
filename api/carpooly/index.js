const startCase = require('lodash/startCase');

const TextSection = require('../../blocks/text-section.block.js');
const ErrorMessage = require('../../blocks/error-message.block.js');
const DatePicker = require('../../blocks/date-picker.block.js');
const TimePicker = require('../../blocks/time-picker.block.js');
const ImageBlock = require('../../blocks/image.block.js');
const ButtonGroup = require('../../blocks/button-group.block.js');

const client = require('../../utils/mongo-client');
const slackResponse = require('../../utils/slack-response');
const services = require('../../services');

client.connect(process.env.MONGO_URI);

const errorBlocks = ({ message }) => {
  return [
    new TextSection({ text: "*Error:* It seems you did not follow Capooly's instructions." }),
    new ErrorMessage({ message }),
    new ImageBlock({
      url: "https://media.giphy.com/media/108GZES8iG0myc/giphy.gif",
      title: "That is why you fail."
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
};

module.exports = async (req, res) => {
  const body = req.body;

  const { text, user_name, user_id, channel_id } = body;

  try {
    const args = parseCommand({ text });

    if (args.length === 1) {
      let [command] = args;

      command = command === 'delete' ? 'deleteOne' : command;

      if (!services[command]) {
        console.log('nocommand')
        return res.status(200).send(
          slackResponse({
            blocks: errorBlocks({
              message: `Illegal Command: ${command}. Valid commands are ${Object.keys(services).join(', ')}.`
            })
          })
        );
      }

      const response = await services[command]({ body });

      res.status(200).send(response);
    } else {
      const [origin, destination, seatsAvailable] = args;

      const carpool = await client.create({
        type: 'Carpool',
        input: {
          userName: user_name,
          userId: user_id,
          channel: channel_id,
          destination,
          origin,
          seatsAvailable,
          passengers: []
        }
      });

      const carpoolId = carpool._id;

      res.status(200).send(
        slackResponse({
          blocks: [
            new TextSection({
              text: `Enter the details of your carpool leaving from ${origin} to ${destination}.`
            }),
            new DatePicker({
              actionId: `select-date:${carpoolId}`
            }),
            new TimePicker({
              actionId: `select-time:${carpoolId}`
            })
          ]
        })
      );
    }
  } catch (error) {
    console.log('err', error)
    res.status(200).send(
      slackResponse({
        blocks: errorBlocks({
          message: `>_Error Message: ${error.message}_`
        })
      })
    );
  }
};

const parseCommand = ({ text }) => {
  const parsedText = [];
  let currentWord = [];
  let endingSymbol = " ";

  text.split("").forEach(letter => {
    if (letter === endingSymbol) {
      endingSymbol = " ";

      if (currentWord.length) {
        parsedText.push(startCase(currentWord.join("")));
      }

      currentWord = [];
      return;
    }

    if (letter === '[') {
      endingSymbol = ']';
      return;
    }

    currentWord.push(letter);
  });

  if (currentWord.length) {
    parsedText.push(currentWord.join(""));
  }

  return parsedText;
};
