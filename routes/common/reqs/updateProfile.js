const { logger } = require('../../../logger');
const bcrypt = require('bcrypt');
const createTruthyObject = require('../../../tools/createTruthyObject.js');
const sanitize = require('../../../tools/sanitize');
const validPassword = require('../../../tools/validPassword');
const cleanUserJson = require('../../../tools/cleanUserJson.js');
const User = require('../../../models/User.model.js');

function updateFields(request, field, dbClient) {
  for (let [key, val] of Object.entries(request)) {
    if (val) dbClient[field][key] = val;
  }
}

const updateProfile = async (req, res) => {
  try {
    const client = req.user._id;
    const field = req.params.field;
    // parse request, include only values to be updated
    let dirtyReq = createTruthyObject(req.body);
    let request = sanitize(dirtyReq);
    let dbClient = await User.findById(client);
    if (!dbClient) throw new Error('Client not found');
    switch (field) {
      case 'name':
      case 'phone':
      case 'email':
      case 'dob':
      case 'insurance':
      case 'emergency_contact':
      case 'address':
        if (request.email) {
          const registered = await User.findOne({
            email: { email: request.email },
          }).exec();
          if (registered)
            return res.status(400).send('Email address unavailable.');
        }
        updateFields(request, field, dbClient);
        break;
      case 'basic':
        for (let [field, keyVal] of Object.entries(request)) {
          updateFields(keyVal, field, dbClient);
        }
        break;
      case 'password':
        const currentPassword = request.currentPassword;
        const newPassword = request.newPassword;
        let correct = await bcrypt.compare(currentPassword, req.user.password);
        if (!correct) return res.status(400).send('Incorrect current password');
        if (!validPassword(newPassword))
          return res.status(400).send('Invalid password.');
        const hash = bcrypt.hashSync(newPassword, 12);
        dbClient.password = hash;
        break;
      case 'travel':
        dbClient.travel = [request, ...dbClient.travel];
        break;
      case 'preferences':
        req.session.cookie.maxAge = req.body.remember
          ? 1000 * 60 * 60 * 24 * 365
          : 1000;
        dbClient.preferences = req.body;
        break;
      default:
        throw new Error('Invalid update field');
    }
    const dirtyClient = await dbClient.save();
    const cleanClient = cleanUserJson(dirtyClient);
    return res.status(200).json(cleanClient);
  } catch (e) {
    logger.error(`updateProfile => \n ${e.stack}`);
    return res.status(500).send('An error occurred. Please try again later.');
  }
};

module.exports = updateProfile;
