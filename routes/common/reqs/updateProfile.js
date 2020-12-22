const { logger } = require('../../../logger');
const bcrypt = require('bcrypt');
const createTruthyObject = require('../../../tools/createTruthyObject.js');
const sanitize = require('../../../tools/sanitize');
const validPassword = require('../../../tools/validPassword');
const User = require('../../../models/User.model.js');

const updateProfile = async (req, res) => {
  try {
    const client = req.user._id;
    const type = req.params.type;
    // parse request, include only values to be updated
    let dirtyReq = createTruthyObject(req.body);
    let request = sanitize(dirtyReq);
    let dbClient = await User.findById(client);
    if (!dbClient) throw new Error('Client not found');
    switch (type) {
      case 'insurance':
      case 'basic':
        if (request.email) {
          const registered = await User.findOne({
            email: request.email,
          }).exec();
          if (registered)
            return res.status(400).send('Email address unavailable.');
        }
        for (let [key, val] of Object.entries(request)) {
          if (val) dbClient[key] = val;
        }
        break;
      case 'emergency_contact':
      case 'address':
        dbClient[type] = Object.assign({}, dbClient[type], request);
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
      default:
        throw new Error('Invalid update type');
    }
    const updatedClient = await dbClient.save();
    return res.status(200).json(updatedClient);
  } catch (e) {
    logger.error(`updateProfile => \n ${e.stack}`);
    return res.status(500).send('An error occurred. Please try again later.');
  }
};

module.exports = updateProfile;
