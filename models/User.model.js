const { ObjectID } = require('mongodb');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Appointment = new Schema({
  _id: ObjectID,
  date: String,
  time: String,
  location: {
    name: String,
    phone: String,
    address: {
      street: String,
      city: String,
      state: String,
      zip: Number,
    },
  },
  tests: [String],
});

const User = new Schema({
  role: { type: String, default: 'client' },
  email: { email: { type: String, default: '', unique: true, required: true } },
  password: String,
  name: {
    firstName: { type: String, default: '' },
    lastName: { type: String, default: '' },
  },
  dob: { dob: { type: String, default: '' } },
  insurance: {
    provider: { type: String, default: '' },
    id: { type: String, default: '' },
  },
  phone: { phone: { type: String, default: '' } },
  address: {
    street: { type: String, default: '' },
    city: { type: String, default: '' },
    state: { type: String, default: '' },
    zip: { type: String, default: '' },
  },
  emergency_contact: {
    name: { type: String, default: '' },
    phone: { type: String, default: '' },
    relation: { type: String, default: '' },
  },
  travel: [],
  appointments: [Appointment],
  preferences: {
    dark: { type: Boolean, default: false },
    remember: { type: Boolean, default: false },
    notifications: { type: Boolean, default: false },
  },
});

module.exports = mongoose.model('user', User);
