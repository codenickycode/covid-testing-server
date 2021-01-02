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
    if (updatedLocations[0]) return res.status(400).send(updatedLocations[0]);
    return res.status(200).json(updatedLocations[1]);
  } catch (e) {
    logger.error(`/locations => \n ${e.stack}`);
    return res.status(500).send(e.message);
  }
};

const getDistance = async (zip, locationZips, locations) => {
  const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${zip}&destinations=${locationZips}&key=${process.env.MAPS_API}`;
  const distanceData = await axios.get(url);
  if (distanceData.data.origin_addresses[0] === '') {
    return ['Invalid zip code.', null];
  }
  const distance = distanceData.data.rows[0].elements;
  locations.forEach((location, i) => {
    location.distance = distance[i].distance.value;
  });
  return [null, locations];
};

module.exports = getLocations;
