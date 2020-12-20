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

// add an appointment
router.route('/appointments').post(ensureAuthenticated, async (req, res) => {
  const { client, name, dob, phone, date, time, location, test } = req.body;
  if (!client || !location || !date || !time)
    return res.status(400).send('required fields missing');
  try {
    const dbLocation = await Location.findById(location);
    if (!dbLocation) throw new Error('location not found');
    for (let appt of dbLocation.appointments) {
      if (appt.date === date && appt.time === time) {
        return res.send('unavailable');
      }
    }
    const _id = new ObjectId();
    let newAppointment = { date, time, test, client, name, dob, phone, _id };
    dbLocation.appointments.unshift(newAppointment);
    await dbLocation.save();
    // adjust newAppointment for client's document
    newAppointment = {
      date,
      time,
      location,
      name: dbLocation.name,
      address: dbLocation.address,
      phone: dbLocation.phone,
      test,
      confirmation: _id,
    };
    let dbClient = await User.findById(client);
    if (!dbClient) throw new Error('client not found');
    dbClient.appointments.unshift(newAppointment);
    const updatedClient = await dbClient.save();
    return res.json(updatedClient);
  } catch (err) {
    console.log('/appointments .post =>\n', err);
    return res.status(500).send('error');
  }
});

// get all client appointments
router.route('/appointments').get(ensureAuthenticated, async (req, res) => {
  const client = req.body.client;
  try {
    const clientDoc = await User.findById(client);
    if (!clientDoc) throw new Error('client not found');
    return res.json(clientDoc.appointments);
  } catch (err) {
    console.log('/appointments .get =>\n', err);
    return res.status(500).send('error');
  }
});

// delete client appointment
router.route('/appointments').delete(ensureAuthenticated, async (req, res) => {
  // parse request
  const { client, location, confirmation } = req.body;
  // require request fields
  if (!client || !location || !confirmation)
    return res.status(400).send('required fields missing');
  // find appointment location
  const dbLocation = await Location.findById(location, {}, (err) => {
    if (err) return res.status(400).send('location not found');
  });
  // confirmed false until we find the appointment
  let confirmed = false;
  for (let [index, appt] of Object.entries(dbLocation.appointments)) {
    if (appt._id.toString() === confirmation) {
      // remove it from location's appointments array
      dbLocation.appointments.splice(index, 1);
      confirmed = true;
    }
  }
  // if we don't find it, return bad request
  if (!confirmed) return res.status(400).send('invalid confirmation number');
  // save location
  dbLocation
    .save()
    .then(async () => {
      // find client
      let dbClient = await User.findById(client, {}, (err) => {
        if (err) return res.status(400).send('client not found');
      });
      // now look for appointment in client's appointments array
      for (let [index, appt] of Object.entries(dbClient.appointments)) {
        if (appt.confirmation.toString() === confirmation)
          // remove it
          dbClient.appointments.splice(index, 1);
      }
      // save client
      dbClient
        .save()
        .then((client) => res.json(client))
        .catch((err) => res.status(400).send('didnt save'));
    })
    .catch((err) => res.status(400).send(err));
});

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
