const express = require('express');
const router = express.Router();
const ensureAuthenticated = require('../tools/ensureAuthenticated.js');
const createTruthyObject = require('../tools/createTruthyObject');
const User = require('../models/User.model.js');
const Location = require('../models/Location.model.js');

// return all Users
router.route('/users').get((req, res) => {
  if (req.user.role !== 'provider') return res.status(403).send('unauthorized');
  User.find()
    .then((users) => res.json(users))
    .catch((err) => res.status(400).json(err));
});

// add a location
router.route('/locations/new').post(ensureAuthenticated, (req, res) => {
  if (req.user.role !== 'provider') return res.status(403).send('unauthorized');
  // create new location with only included fields
  const location = createTruthyObject(req.body);
  // create new document
  newLocation = new Location(location);
  // save it
  newLocation
    .save()
    .then((dbLocation) => res.json(dbLocation))
    .catch((err) => res.status(400).json(err));
});

// update a location
router
  .route('/locations/update/:type')
  .post(ensureAuthenticated, async (req, res) => {
    if (req.user.role !== 'provider')
      return res.status(403).send('unauthorized');
    // parse request
    const type = req.params.type;
    // create new request with only included fields
    let request = createTruthyObject(req.body);
    // must include location to update
    if (!request.location) return res.status(400).send('must specify location');
    // no need to add location _id to document
    delete request.location;
    // find location
    const dbLocation = await Location.findById(req.body.location, (err) => {
      if (err) return res.status(400).send('location not found');
    });
    // update location document based on type of request
    switch (type) {
      case 'basic':
        for (let [key, val] of Object.entries(request)) {
          // only add value if included in request
          if (val) dbLocation[key] = val;
        }
        break;
      case 'address':
        dbLocation.address = Object.assign({}, dbLocation.address, request);
        break;
      case 'tests':
        dbLocation.tests = Object.assign([], request.tests);
        break;
      default:
        return res.status(400).send('invalid update');
    }
    // save updated location document
    dbLocation
      .save()
      .then((location) => res.json(location))
      .catch((err) => res.status(400).json(err));
  });

module.exports = router;
