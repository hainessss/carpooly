module.exports = function ErrorMessage({ message }) {
  return {
    type: "context",
    elements: [
      {
        "type": "mrkdwn",
        "text": `>_Error Message: ${message}_`
      }
    ]
  };
};