const startCase = require('lodash/startCase');

const timePromptBlock = require('./timePrompt.block.js');
const errorBlock = require('./error.block.js');
const client = require('../../mongo-client');

client.connect(process.env.MONGO_URI);

module.exports = async (req, res) => {
  const body = req.body;

  const { text, user_name, user_id } = body;

  try {
    const [origin, destination, seatsAvailable] = parseCommand({ text });

    await client.create({
      type: 'Carpool',
      input: {
        userName: user_name,
        userId: user_id,
        destination,
        origin,
        seatsAvailable,
        passengers: []
      }
    });

    res.status(200).send(timePromptBlock({
      origin,
      destination
    }));
  } catch (error) {
    console.log('err', error)
    res.status(200).send(errorBlock({ error }));
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
