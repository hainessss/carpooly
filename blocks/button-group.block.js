module.exports = function ButtonGroup({ id, buttons }) {
  return {
    type: "actions",
    block_id: id,
    elements: buttons.map(({ text, actionId, value = "null", style }) => ({
      type: "button",
      action_id: actionId,
      style,
      text: {
        type: "plain_text",
        text,
        emoji: true
      },
      value
    }))
  };
};