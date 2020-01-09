module.exports = function DatePicker({ actionId }) {
  return {
    type: "section",
    text: {
      type: "mrkdwn",
      text: "Pick a departure date."
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