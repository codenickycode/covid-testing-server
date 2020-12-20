const { logger } = require('../../logger');
const bcrypt = require('bcrypt');
const User = require('../../models/User.model.js');

const registerPost = async (req, res) => {
  const { role, email, password } = req.body;
  try {
    if (!email) return { status: 400, body: 'Email field required' };
    if (!password) return { status: 400, body: 'Password field required.' };
    const user = await User.findOne({ email }).exec();
    if (user) return { status: 400, body: 'User already registered.' };
    const hash = bcrypt.hashSync(password, 12);
    const newUser = new User({ role, email, password: hash });
    const dbUser = await newUser.save();
    req.login(dbUser, (e) => {
      if (e) throw e;
      return res.status(200).send('Success! You are now logged in.');
    });
  } catch (e) {
    logger.error(`registerPost => %o`, { role, email, error: e.message });
    return res.status(500).send('An error occurred. Please try again later.');
  }
};

module.exports = registerPost;
