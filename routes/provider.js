const { logger } = require('../logger');
const express = require('express');
const router = express.Router();
const ensureAuthenticated = require('../tools/ensureAuthenticated.js');
const createTruthyObject = require('../tools/createTruthyObject');
const User = require('../models/User.model.js');
const Location = require('../models/Location.model.js');
const updateLocation = require('./reqs/updateLocation.js');

// return all Users
router.route('/users').get((req, res) => {
  if (req.user.role !== 'provider') return res.status(403).send('unauthorized');
  User.find()
    .then((users) => res.status(200).json(users))
    .catch((e) => {
      logger.error(`/users => \n ${e.stack}`);
      return res.status(500).send('An error occurred. Please try again later.');
    });
});

// add a location
router.route('/locations/new').post(ensureAuthenticated, (req, res) => {
  if (req.user.role !== 'provider') return res.status(403).send('unauthorized');
  newLocation = new Location(createTruthyObject(req.body));
  newLocation
    .save()
    .then((dbLocation) => res.status(200).json(dbLocation))
    .catch((e) => {
      logger.error(`/locations/new => \n ${e.stack}`);
      return res.status(500).send('An error occurred. Please try again later.');
    });
});

// update a location
router
  .route('/locations/update/:type')
  .post(ensureAuthenticated, (req, res) => updateLocation(req, res));

module.exports = router;
