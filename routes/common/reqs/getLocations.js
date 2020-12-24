const { logger } = require('../../../logger');
const Location = require('../../../models/Location.model.js');

const getLocations = async (req, res) => {
  Location.find()
    .then((locations) => res.status(200).json(locations))
    .catch((e) => {
      logger.error(`/locations => \n ${e.stack}`);
      return res.status(500).send('An error occurred. Please try again later.');
    });
};

module.exports = getLocations;
