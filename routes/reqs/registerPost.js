const { logger } = require('../../logger');
const bcrypt = require('bcrypt');
const User = require('../../models/User.model.js');
const sanitizeMongoose = require('../../tools/sanitizeMongoose.js');

const validate = (email, password, res) => {
  if (!email) {
    res.status(400).send('Email field required');
    return false;
  } else if (!password) {
    res.status(400).send('Password field required.');
    return false;
  } else if (!password.match(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/)) {
    res.status(400).send('Invalid password.');
    return false;
  }
  return true;
};

const registerPost = async (req, res) => {
  const cleanReq = sanitizeMongoose(req.body);
  const { role, email, password } = cleanReq;
  try {
    if (!validate(email, password, res)) return;
    const registered = await User.findOne({ email }).exec();
    if (registered) return res.status(400).send('User already registered.');
    const hash = bcrypt.hashSync(password, 12);
    const newUser = new User({ role, email, password: hash });
    const dbUser = await newUser.save();
    req.login(dbUser, (e) => {
      if (e) throw e;
      return res.status(200).send('Success! You are now logged in.');
    });
  } catch (e) {
    logger.error(`registerPost => \n ${e.stack}`);
    return res.status(500).send('An error occurred. Please try again later.');
  }
};

module.exports = registerPost;
