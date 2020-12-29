const { logger } = require('../../../logger');
const Location = require('../../../models/Location.model.js');
const axios = require('axios');
require('dotenv').config();

const getLocations = async (req, res) => {
  try {
    const locations = await Location.find().exec();
    let locationZips = '';
    for (let location of locations) {
      locationZips += location.address.zip + '|';
    }
    const updatedLocations = await getDistance(req.query.zip, locationZips, [
      ...locations,
    ]);
    return res.status(200).json(updatedLocations);
  } catch (e) {
    logger.error(`/locations => \n ${e.stack}`);
    return res.status(500).send('An error occurred. Please try again later.');
  }
};

const getDistance = async (zip, locationZips, locations) => {
  const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${zip}&destinations=${locationZips}&key=${process.env.MAPS_API}`;
  const distanceData = await axios.get(url);
  const distance = distanceData.data.rows[0].elements;
  locations.forEach((location, index) => {
    location.distance = distance[index].distance.value;
  });
  return locations;
};

module.exports = getLocations;
