module.exports = function TextSection({ text }) {
  return {
    type: "section",
    text: {
      type: "mrkdwn",
      text
    }
  };
};