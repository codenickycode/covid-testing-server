const express = require('express');
const router = express.Router();
const ensureAuthenticated = require('../../tools/ensureAuthenticated.js');
const reqs = require('./reqs/providerReqs.js');

const authorize = (req, res, next) => {
  if (req.user.role !== 'provider') return res.status(403).send('unauthorized');
  return next();
};

// return all Users
router
  .route('/users')
  .get(ensureAuthenticated, authorize, (req, res) => reqs.getUsers(req, res));

// add a location
router
  .route('/locations/new')
  .post(ensureAuthenticated, authorize, (req, res) =>
    reqs.newLocation(req, res)
  );

// update a location
router
  .route('/locations/update/:type')
  .post(ensureAuthenticated, authorize, (req, res) =>
    reqs.updateLocation(req, res)
  );

module.exports = router;
