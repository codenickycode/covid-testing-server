const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = new Schema({
  role: { type: String, default: 'client' },
  email: String,
  password: String,
  name: String,
  dob: String,
  ins_provider: String,
  ins_id: String,
  phone: String,
  address: {
    street: String,
    city: String,
    state: String,
    zip: Number,
  },
  emergency_contact: {
    name: String,
    phone: String,
    relation: String,
  },
  travel: [],
});

module.exports = mongoose.model('user', User);
