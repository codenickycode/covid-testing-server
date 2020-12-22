const { logger } = require('../../../logger');
const User = require('../../../models/User.model.js');

const getUsers = (req, res) => {
  User.find()
    .then((users) => res.status(200).json(users))
    .catch((e) => {
      logger.error(`/users => \n ${e.stack}`);
      return res.status(500).send('An error occurred. Please try again later.');
    });
};

module.exports = getUsers;
