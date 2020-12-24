const { logger } = require('../../../logger');
const axios = require('axios');
const Location = require('../../../models/Location.model.js');
require('dotenv').config();

const getLocations = async (req, res) => {
  try {
    const locations = await Location.find();
    const { zip } = req.query;
    let locationZips = '';
    for (let location of locations) {
      locationZips += location.address.zip + '|';
    }
    let url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${zip}&destinations=${locationZips}&key=${process.env.MAPS_API}`;
    const distanceData = await axios.get(url);
    const distance = distanceData.data.rows[0].elements;
    const updatedLocations = [];
    locations.forEach((location, index) => {
      updatedLocations.push(
        Object.assign({
          ...location._doc,
          distance: distance[index].distance.value,
        })
      );
    });
    return res.status(200).json(updatedLocations);
  } catch (e) {
    logger.error(`/locations => \n ${e.stack}`);
    return res.status(500).send('An error occurred. Please try again later.');
  }
};

module.exports = getLocations;
