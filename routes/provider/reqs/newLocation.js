const { logger } = require('../../../logger');
const Location = require('../../../models/Location.model.js');
const createTruthyObject = require('../../../tools/createTruthyObject');

const newLocation = (req, res) => {
  location = new Location(createTruthyObject(req.body));
  location
    .save()
    .then((dbLocation) => res.status(200).json(dbLocation))
    .catch((e) => {
      logger.error(`/locations/new => \n ${e.stack}`);
      return res.status(500).send('An error occurred. Please try again later.');
    });
};

module.exports = newLocation;
