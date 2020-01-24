module.exports = function DatePicker({ actionId, promptText }) {
  return {
    type: "section",
    text: {
      type: "mrkdwn",
      text: promptText
    },
    accessory: {
      type: "datepicker",
      action_id: actionId,
      placeholder: {
        type: "plain_text",
        text: "Select a date",
        emoji: true
      }
    }
  };
};