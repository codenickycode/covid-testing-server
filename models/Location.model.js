const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

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

Location.plugin(passportLocalMongoose);

module.exports = mongoose.model('location', Location);
