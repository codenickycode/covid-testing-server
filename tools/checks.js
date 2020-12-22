const User = require('../models/User.model.js');

const registeredEmail = async (email) => {
  const registered = await User.findOne({ email }).exec();
  if (registered) return true;
  return false;
};

const validPassword = (password) => {
  return password.match(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/);
};

module.exports = { registeredEmail, validPassword };
