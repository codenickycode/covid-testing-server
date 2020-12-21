const { logger } = require('../logger');
const express = require('express');
const router = express.Router();
const passport = require('passport');
const bcrypt = require('bcrypt');
const { ObjectId } = require('mongodb');
const ensureAuthenticated = require('../tools/ensureAuthenticated.js');
const createTruthyObject = require('../tools/createTruthyObject.js');
const User = require('../models/User.model.js');
const Location = require('../models/Location.model.js');
const registerPost = require('./reqs/registerPost.js');
const getAppointments = require('./reqs/getAppointments.js');
const addAppointment = require('./reqs/addAppointment.js');
const deleteAppointment = require('./reqs/deleteAppointment.js');

// user login
router
  .route('/login')
  .post(passport.authenticate('local'), (req, res, next) => {
    res.send('success');
  });

// user logout *** where does this go???
router.route('/logout').get((req, res) => {
  console.log('fix this redirect');
  req.logout();
  res.redirect('/'); // ???
});

// return all locations
router.route('/locations').get((req, res) => {
  Location.find()
    .then((locations) => res.json(locations))
    .catch((err) => res.status(400).json(err));
});

router.route('/register').post((req, res) => registerPost(req, res));

router
  .route('/appointments')
  .get(ensureAuthenticated, (req, res) => getAppointments(req, res))
  .post(ensureAuthenticated, (req, res) => addAppointment(req, res))
  .delete(ensureAuthenticated, (req, res) => deleteAppointment(req, res));

// update client profile
router.route('/update/:type').post(ensureAuthenticated, async (req, res) => {
  // type of update
  const type = req.params.type;
  // parse request, include only values to be updated
  let request = createTruthyObject(req.body);
  if (!request.client) return res.send('must provide client id');
  // no need to add client _id field to db
  delete request.client;
  // find client
  let dbClient = await User.findById(req.body.client, (err) => {
    if (err) return res.status(400).send('location not found');
  });
  // check type of update
  switch (type) {
    case 'insurance':
    case 'basic':
      for (let [key, val] of Object.entries(request)) {
        // if value exists in request, change it in client document
        if (val) dbClient[key] = val;
      }
      break;
    case 'emergency_contact':
    case 'address':
      dbClient[type] = Object.assign({}, dbClient[type], request);
      break;
    case 'password':
      const hash = bcrypt.hashSync(request.password, 12);
      dbClient.password = hash;
      break;
    case 'travel':
      // add new travel history at front
      dbClient.travel = [request, ...dbClient.travel];
      break;
    default:
      return res.status(400).send('invalid update');
  }
  // save client
  dbClient
    .save()
    .then((client) => res.json(client))
    .catch((err) => res.status(400).json(err));
});

// get client document
router.route('/').get(ensureAuthenticated, (req, res) => {
  // parse request
  let client = req.body.client;
  // find client
  User.findById(client, {}, (err) => {
    if (err) return res.status(400).send('client not found');
  }).then((client) => res.json(client));
});

// catch all invalid endpoints
router.use((req, res, next) => {
  res.status(404).type('text').send('Not Found');
});

module.exports = router;
