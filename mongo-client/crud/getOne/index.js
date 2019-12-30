const mongoose = require('mongoose');

module.exports = ({query = {}, type}) => {
  let Model, error;

  try {
      Model = mongoose.model(type);
  } catch(err) {
      error = err;
  }
  console.log('query!!!!', query)
  return error ? Promise.reject(error) : Model.findOne(query);
}