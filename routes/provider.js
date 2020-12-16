const express = require('express');
const router = express.Router();
const passport = require('passport');
const bcrypt = require('bcrypt');
const ensureAuthenticated = require('../tools/ensureAuthenticated.js');
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

// add provider to db with email and password
router.route('/register').post((req, res) => {
  const { email, password } = req.body;
  const hash = bcrypt.hashSync(password, 12);
  const newProvider = new Provider({ email, password: hash });
  Provider.findOne({ email: newProvider.email })
    .then((provider) => {
      if (provider) {
        return res.send(false);
      } else {
        newProvider
          .save()
          .then(passport.authenticate('providerLocal'), (req, res, next) => {
            res.send('success');
          })
          .catch((err) => res.status(400).json(err));
      }
    })
    .catch((err) => res.status(400).json(err));
});

// login
router
  .route('/login')
  .post(passport.authenticate('providerLocal'), (req, res, next) => {
    res.send('success');
  });

// add a location
router.route('/locations/new').post(ensureAuthenticated, (req, res) => {
  const newObj = createTruthyObject(req.body);
  if (!username) return res.status(403).send('unauthorized');
  delete newObj.username;
  newLocation = new Location(newObj);
  newLocation
    .save()
    .then((location) => res.json(location))
    .catch((err) => res.status(400).json(err));
});

// update a location
router
  .route('/locations/update/:type')
  .post(ensureAuthenticated, async (req, res) => {
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

// get user(s)

// get appointments

// add appointment

// update appointment

// delete appointment

router.route('/logout').get((req, res) => {
  req.logout();
  res.redirect('/');
});

router.use((req, res, next) => {
  res.status(404).type('text').send('Not Found');
});

module.exports = router;
