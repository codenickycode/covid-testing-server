const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Provider = new Schema({
  username: String,
  password: String,
});

module.exports = mongoose.model('provider', Provider);
