const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const { logger } = require('../../../logger');
const User = require('../../../models/User.model.js');
require('dotenv').config();

const forgotPassword = async (req, res) => {
  const email = req.body.email;
  try {
    let dbClient = await User.findOne({
      email: { email },
    }).exec();
    const password = Math.random().toString(36).substr(2, 8);
    console.log(password);
    const hash = bcrypt.hashSync(password, 12);
    dbClient.password = hash;
    await dbClient.save();
    await sendPW(email, password);
    return res.status(200).send('Password reset');
  } catch (e) {
    logger.error(`/forgot => \n ${e.stack}`);
    return res.status(500).send('An error occurred. Please try again later.');
  }
};

module.exports = forgotPassword;

const sendPW = async (email, password) => {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });
  const info = await transporter.sendMail({
    from: '"COVID Test Site" <codenickycode@gmail.com>',
    to: email,
    subject: 'Your temporary password',
    text: `Your temporary password is: ${password}.  Please login and choose a new password.`,
    html: `<h4>Your temporary password is:</h4><h1>${password}</h1><br><p>Please login and choose a new password.</p><p><a href='#'>COVID-19 Test Site</a>`,
  });
  logger.info('Message sent: %s', info.messageId);
};
