const { logger } = require('../../../logger');
const cleanUserJson = require('../../../tools/cleanUserJson.js');
const User = require('../../../models/User.model.js');

const getClient = (req, res) => {
  User.findById(req.user._id)
    .then((client) => {
      const cleanClient = cleanUserJson(client);
      res.status(200).json(cleanClient);
    })
    .catch((e) => {
      logger.error(`/locations => \n ${e.stack}`);
      return res.status(500).send('An error occurred. Please try again later.');
    });
};

module.exports = getClient;
