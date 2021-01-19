const { logger } = require('../../../logger');
const bcrypt = require('bcrypt');
const User = require('../../../models/User.model.js');
const sanitize = require('../../../tools/sanitize.js');
const validPassword = require('../../../tools/validPassword');
const cleanUserJson = require('../../../tools/cleanUserJson.js');

const registerUser = async (req, res) => {
  try {
    const request = sanitize(req.body);
    const { role, email, password } = request;
    if (!validPassword(password))
      return res.status(400).send('Invalid password.');
    const registered = await User.findOne({ email: { email } }).exec();
    if (registered) return res.status(400).send('User already registered.');
    const hash = bcrypt.hashSync(password, 12);
    const newUser = new User({ role, email: { email }, password: hash });
    const dbUser = await newUser.save();
    req.login(dbUser, (e) => {
      if (e) throw e;
      const response = cleanUserJson(dbUser);
      // req.session.user = response;
      return res.status(200).json(response);
    });
  } catch (e) {
    logger.error(`registerUser => \n ${e.stack}`);
    return res.status(500).send('An error occurred. Please try again later.');
  }
};

module.exports = registerUser;
