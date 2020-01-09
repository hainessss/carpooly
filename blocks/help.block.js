module.exports = function Help({ commands }) {
  const fields = [
    {
      type: "mrkdwn",
      text: "*Command*"
    },
    {
      type: "mrkdwn",
      text: "*Description*"
    }
  ].concat(commands.reduce((fields, { command, description }) => {
    return fields.concat([
      {
        type: "mrkdwn",
        text: command
      },
      {
        type: "mrkdwn",
        text: description
      }
    ]);
  }, []));

  return {
    type: "section",
    fields
  };
};
