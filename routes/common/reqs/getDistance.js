const { logger } = require('../../../logger');
const axios = require('axios');
require('dotenv').config();

const getDistance = async (req, res) => {
  try {
    const { zip, locationZips, locations } = req.body;
    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${zip}&destinations=${locationZips}&key=${process.env.MAPS_API}`;
    const distanceData = await axios.get(url);
    const distance = distanceData.data.rows[0].elements;
    locations.forEach((location, index) => {
      location.distance = distance[index].distance.value;
    });
    return res.status(200).json(locations);
  } catch (e) {
    logger.error(`/locations/distance => \n ${e.stack}`);
    return res.status(500).send('An error occurred. Please try again later.');
  }
};

module.exports = getDistance;
