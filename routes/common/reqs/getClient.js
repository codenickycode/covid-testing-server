const { logger } = require('../../../logger');
const User = require('../../../models/User.model.js');

const getClient = (req, res) => {
  User.findById(req.user._id)
    .then((client) => res.status(200).json(client))
    .catch((e) => {
      logger.error(`/locations => \n ${e.stack}`);
      return res.status(500).send('An error occurred. Please try again later.');
    });
};

module.exports = getClient;
