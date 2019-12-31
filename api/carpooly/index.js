const MongoClient = require('../../mongo-client');

const client = new MongoClient();

client.connect(process.env.MONGO_URI);

console.log(MongoClient);

module.exports = async (req, res) => {
  const body = req.body;

  const { text, command, user_name } = body;

  const parsedText = [];
  let currentWord = [];
  let endingSymbol = " ";

  text.split("").forEach(letter => {
    if (letter === endingSymbol) {
      endingSymbol = " ";

      if (currentWord.length) {
        parsedText.push(currentWord.join(""));
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

  const [destination, origin, departingAt, seatsAvailable] = parsedText;
  
  try {
    const carpool = await client.create({
      type: 'Carpool',
      input: {
        destination,
        origin,
        departingAt,
        seatsAvailable
      } 
    });
  } catch (err) {
    console.log('carpool err', err);
  }

  res.status(200).send({
    "blocks": [
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": `Enter the details of your carpool heading to ${destination} from ${origin}.`
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
          "placeholder": {
            "type": "plain_text",
            "text": "Select an item",
            "emoji": true
          },
          "options": [
            {
              "text": {
                "type": "plain_text",
                "text": "Choice 1",
                "emoji": true
              },
              "value": "value-0"
            },
            {
              "text": {
                "type": "plain_text",
                "text": "Choice 2",
                "emoji": true
              },
              "value": "value-1"
            },
            {
              "text": {
                "type": "plain_text",
                "text": "Choice 3",
                "emoji": true
              },
              "value": "value-2"
            }
          ]
        }
      }
    ]
  });
};
