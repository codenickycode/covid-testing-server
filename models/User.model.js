const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = new Schema({
  role: { type: String, default: 'client' },
  email: { email: { type: String, default: '' } },
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
    zip: { type: Number, default: '' },
  },
  emergency_contact: {
    name: { type: String, default: '' },
    phone: { type: String, default: '' },
    relation: { type: String, default: '' },
  },
  travel: [],
});

module.exports = mongoose.model('user', User);
