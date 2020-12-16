const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const Provider = new Schema({
  username: String,
  password: String,
});

Provider.plugin(passportLocalMongoose);

module.exports = mongoose.model('provider', Provider);
