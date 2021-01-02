const { logger } = require('../../../logger');
const Location = require('../../../models/Location.model.js');

const getLocations = async (req, res) => {
  try {
    const locations = await Location.find().exec();
    return res.status(200).json(locations);
  } catch (e) {
    logger.error(`/locations => \n ${e.stack}`);
    return res.status(500).send(e.message);
  }
};

module.exports = getLocations;
