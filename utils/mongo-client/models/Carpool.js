const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Carpool = new Schema({
  userName: String,
  userId: String,
  channel: String,
  origin: {
    type: String,
    required: true
  },
  departingDate: Date,
  departingTime: String,
  destination: { 
    type:String,
    required: true
  },
  returningDate: Date,
  returningTime: String,
  seatsAvailable: { 
    type: Number,
    required: true
  },
  passengers: [String]
}, {
  timestamps: true
});

Carpool.index({ userId: 1 });

module.exports = mongoose.model('Carpool', Carpool);
