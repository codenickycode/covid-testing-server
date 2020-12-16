const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');
const createTruthyObject = require('../tools/createTruthyObject');
const Location = require('../models/Location.model.js');
const Provider = require('../models/Provider.model.js');

// return all locations
router.route('/locations').get((req, res) => {
  Location.find()
    .then((locations) => res.json(locations))
    .catch((err) => res.status(400).json(err));
});

router.route('/login').post((req, res) => {
  const { username, password } = req.body;
  Provider.findOne({ username })
    .then((provider) => {
      if (!provider) {
        return res.send('invalid username');
      } else if (password !== provider.password) {
        return res.send('invalid password');
      } else {
        return res.send('success');
      }
    })
    .catch((err) => res.status(400).json(err));
});

router.route('/locations/new').post((req, res) => {
  const newObj = createTruthyObject(req.body);
  if (!username) return res.status(403).send('unauthorized');
  delete newObj.username;
  newLocation = new Location(newObj);
  newLocation
    .save()
    .then((location) => res.json(location))
    .catch((err) => res.status(400).json(err));
});

router.route('/locations/update/:type').post(async (req, res) => {
  const type = req.params.type;
  let request = createTruthyObject(req.body);
  if (!request.username) return res.status(403).send('unauthorized');
  if (!request.location) return res.status(400).send('must specify location');
  ['username', 'location'].forEach((k) => delete request[k]);
  const dbLocation = await Location.findById(req.body.location, (err) => {
    if (err) return res.status(400).send('location not found');
  });
  switch (type) {
    case 'basic':
      for (let [key, val] of Object.entries(request)) {
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
  dbLocation
    .save()
    .then((location) => res.json(location))
    .catch((err) => res.status(400).json(err));
});

router.route('/appointments/add').post(async (req, res) => {});

module.exports = router;
