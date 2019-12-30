

module.exports = (req, res) => {

  console.log(req.body);
  res.status(200).send({
      "blocks": [
          {
              "type": "section",
              "text": {
                  "type": "mrkdwn",
                  "text": "*It's 80 degrees right now.*"
              }
          },
          {
              "type": "section",
              "text": {
                  "type": "mrkdwn",
                  "text": "Partly cloudy today and tomorrow"
              }
          }
      ]
  })
};
