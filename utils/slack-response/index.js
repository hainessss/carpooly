
module.exports = ({
  responseType = 'ephemeral',
  deleteOriginal = 'false',
  replaceOriginal = 'false',
  blocks = []
}) => {
  return {
    response_type: responseType,
    replace_original: replaceOriginal,
    delete_original: deleteOriginal,
    blocks
  };
};
