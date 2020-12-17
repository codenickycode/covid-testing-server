const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// const passportLocalMongoose = require('passport-local-mongoose');

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
  appointments: [
    {
      date: String,
      time: String,
      location: String,
      name: String,
      address: {
        street: String,
        city: String,
        state: String,
        zip: Number,
      },
      phone: String,
      test: String,
      confirmation: String,
    },
  ],
});

// User.plugin(passportLocalMongoose);

module.exports = mongoose.model('user', User);
