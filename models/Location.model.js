const { ObjectID } = require('mongodb');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Appointment = new Schema({
  _id: ObjectID,
  date: String,
  time: String,
});

const Location = new Schema({
  name: String,
  phone: String,
  address: {
    street: String,
    city: String,
    state: String,
    zip: Number,
  },
  tests: [String],
  appointments: [Appointment],
});

module.exports = mongoose.model('location', Location);
