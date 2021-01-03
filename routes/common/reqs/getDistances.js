const { logger } = require('../../../logger');
const axios = require('axios');
require('dotenv').config();

const getDistances = async (req, res) => {
  try {
    const { zip, locationsZips, locations } = req.body;
    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${zip}&destinations=${locationsZips}&key=${process.env.MAPS_API}`;
    const distanceData = await axios.get(url);
    if (distanceData.data.origin_addresses[0] === '')
      return res.status(400).send('Invalid zip code.');
    const distances = distanceData.data.rows[0].elements;
    locations.forEach((location, i) => {
      location.distance = distances[i].distance.value;
    });
    return res.status(200).json(locations);
  } catch (e) {
    logger.error(`/locations => \n ${e.stack}`);
    return res.status(500).send(e.message);
  }
};

module.exports = getDistances;
