const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Appointment = new Schema({
  _id: Schema.Types.ObjectId,
  date: String,
  time: String,
  location: String,
  client: String,
  tests: [String],
});

module.exports = mongoose.model('appointment', Appointment);
