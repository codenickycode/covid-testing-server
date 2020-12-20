const logger = require('../../logger');
const bcrypt = require('bcrypt');
const User = require('../../models/User.model.js');

const registerPost = async (req, res) => {
  const { role, email } = req.body;
  logger.info(`${email} is attempting to register, role: ${role}`);
  try {
    const { status, body, dbUser } = await registerNewUser(req);
    if (status === 200) {
      logger.info(status + ': ' + body);
      req.login(dbUser, (e) => {
        if (e) throw e;
        logger.info(`${email} logged in.`);
        return res.status(200).send('Success! You are now logged in.');
      });
    } else {
      // status is 400
      logger.info(status + ': ' + body);
      return res.status(status).send(body);
    }
  } catch (e) {
    logger.error(`registerPost => %o`, { role, email, error: e.message });
    return res.status(500).send('An error occurred. Please try again later.');
  }
};

const registerNewUser = async (req) => {
  const { role, email, password } = req.body;
  if (!email) return { status: 400, body: 'Email field required' };
  if (!password) return { status: 400, body: 'Password field required.' };
  const user = await User.findOne({ email }).exec();
  if (user) return { status: 400, body: 'User already registered.' };
  const hash = bcrypt.hashSync(password, 12);
  const newUser = new User({ role, email, password: hash });
  const dbUser = await newUser.save();
  return { status: 200, body: `${email} successfully registered.`, dbUser };
};

module.exports = registerPost;
