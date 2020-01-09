const mongoose = require('mongoose');

module.exports = ({query = {}, type}) => {
  let Model, error;

  try {
      Model = mongoose.model(type);
  } catch(err) {
      error = err;
  }

  return error ? Promise.reject(error) : Model.deleteOne(query);
}