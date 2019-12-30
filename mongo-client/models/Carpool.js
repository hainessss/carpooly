const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Carpool = new Schema({
  user: String,
  origin: String,
  departingAt: String,
  destination: String,
  seatsAvailable: Number,
  passengers: [String]
});

Carpool.index({ user: 1 });

module.exports = mongoose.model('Carpool', Carpool);
