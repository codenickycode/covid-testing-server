const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Location = new Schema({
  name: String,
  phone: String,
  address: {
    street: String,
    city: String,
    state: String,
    zip: Number,
  },
  appointments: [
    {
      _id: Schema.Types.ObjectId,
      date: String,
      time: String,
      test: String,
      client: String,
      name: String,
      dob: String,
      phone: String,
    },
  ],
  tests: [String],
});

module.exports = mongoose.model('location', Location);
