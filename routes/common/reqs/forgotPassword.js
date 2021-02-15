const bcrypt = require('bcrypt');
const { logger } = require('../../../logger');
const User = require('../../../models/User.model.js');

const forgotPassword = async (req, res) => {
  try {
    let dbClient = await User.findOne({
      email: { email: req.body.email },
    }).exec();
    const random = Math.random().toString(36).substr(2, 8);
    console.log(random);
    const hash = bcrypt.hashSync(random, 12);
    dbClient.password = hash;
    await dbClient.save();
    return res.status(200).send('Password reset');
  } catch (e) {
    logger.error(`/forgot => \n ${e.stack}`);
    return res.status(500).send('An error occurred. Please try again later.');
  }
};

module.exports = forgotPassword;
