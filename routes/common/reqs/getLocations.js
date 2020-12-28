const { logger } = require('../../../logger');
const Location = require('../../../models/Location.model.js');
const Appointment = require('../../../models/Appointment.model.js');
const getLocations = async (req, res) => {
  try {
    let locations = await Location.find().exec();
    let appointments = await Appointment.find().exec();

    return res.status(200).json(locations);
  } catch (e) {
    logger.error(`/locations => \n ${e.stack}`);
    return res.status(500).send('An error occurred. Please try again later.');
  }
};

module.exports = getLocations;
