const express = require('express');
const router = express.Router();
const passport = require('passport');
const bcrypt = require('bcrypt');
const ensureAuthenticated = require('../tools/ensureAuthenticated.js');
const { ObjectId } = require('mongodb');
const createTruthyObject = require('../tools/createTruthyObject.js');
const Client = require('../models/Client.model.js');
const Location = require('../models/Location.model.js');

// return all locations
router.route('/locations').get((req, res) => {
  Location.find()
    .then((locations) => res.json(locations))
    .catch((err) => res.status(400).json(err));
});

// add client to db with email and password
router.route('/register').post((req, res) => {
  const { email, password } = req.body;
  const hash = bcrypt.hashSync(password, 12);
  const newClient = new Client({ email, password: hash });
  Client.findOne({ email: newClient.email })
    .then((client) => {
      if (client) {
        return res.send(false);
      } else {
        newClient
          .save()
          .then((user) => {
            req.login(user, (err) => {
              if (!err) {
                return res.send('success');
              } else {
                return res.status(400).send('post-register login error');
              }
            });
          })
          .catch((err) => res.status(400).send('post-save error'));
      }
    })
    .catch((err) => res.status(400).send('find error'));
});

// login
router
  .route('/login')
  .post(passport.authenticate('clientLocal'), (req, res, next) => {
    res.send('success');
  });

// add an appointment
router.route('/appointments').post(ensureAuthenticated, async (req, res) => {
  const { client, name, dob, phone, date, time, location, test } = req.body;
  const dbLocation = await Location.findById(location, {}, (err) => {
    if (err) return res.send('location not found');
  });
  for (let appt of dbLocation.appointments) {
    if (appt.date === date && appt.time === time) {
      return res.send('unavailable');
    }
  }
  const _id = new ObjectId();
  dbLocation.appointments.unshift({
    date,
    time,
    test,
    client,
    name,
    dob,
    phone,
    _id,
  });
  dbLocation
    .save()
    .then(async () => {
      const newAppointment = {
        date,
        time,
        location,
        name: dbLocation.name,
        address: dbLocation.address,
        phone: dbLocation.phone,
        test,
        confirmation: _id,
      };
      let dbClient = await Client.findById(client, {}, (err) => {
        if (err) return res.status(400).send('client not found');
      });
      dbClient.appointments.unshift(newAppointment);
      dbClient
        .save()
        .then((client) => res.json(client))
        .catch((err) => res.status(400).send(err));
    })
    .catch((err) => res.status(400).send(err));
});

router.route('/appointments').get(ensureAuthenticated, async (req, res) => {
  const client = req.body.client;
  const clientDoc = await Client.findById(client, {}, (err) => {
    if (err) return res.status(400).send('client not found');
  });
  return res.json(clientDoc.appointments);
});

router.route('/appointments').delete(ensureAuthenticated, async (req, res) => {
  const { client, location, confirmation } = req.body;
  if (!client || !location || !confirmation)
    return res.status(400).send('required fields missing');
  const dbLocation = await Location.findById(location, {}, (err) => {
    if (err) return res.status(400).send('location not found');
  });
  let confirmed = false;
  for (let [index, appt] of Object.entries(dbLocation.appointments)) {
    if (appt._id.toString() === confirmation) {
      dbLocation.appointments.splice(index, 1);
      confirmed = true;
    }
  }
  if (!confirmed) return res.status(400).send('invalid confirmation number');
  dbLocation
    .save()
    .then(async () => {
      let dbClient = await Client.findById(client, {}, (err) => {
        if (err) return res.status(400).send('client not found');
      });
      for (let [index, appt] of Object.entries(dbClient.appointments)) {
        if (appt.confirmation.toString() === confirmation)
          dbClient.appointments.splice(index, 1);
      }
      dbClient
        .save()
        .then((client) => res.json(client))
        .catch((err) => res.status(400).send('didnt save'));
    })
    .catch((err) => res.status(400).send(err));
});

router.route('/update/:type').post(ensureAuthenticated, async (req, res) => {
  const type = req.params.type;
  let request = createTruthyObject(req.body);
  if (!request.client) return res.send('must provide client id');
  delete request.client;
  let dbClient = await Client.findById(req.body.client, (err) => {
    if (err) return res.status(400).send('location not found');
  });
  switch (type) {
    case 'insurance':
    case 'basic':
      for (let [key, val] of Object.entries(request)) {
        if (val) dbClient[key] = val;
      }
      break;
    case 'emergency_contact':
    case 'address':
      dbClient[type] = Object.assign({}, dbClient[type], request);
      break;
    case 'password':
      // obviously a lot more than this;
      dbClient.password = request.password;
      break;
    case 'travel':
      dbClient.travel = [request, ...dbClient.travel];
      break;
    default:
      return res.status(400).send('invalid update');
  }
  dbClient
    .save()
    .then((client) => res.json(client))
    .catch((err) => res.status(400).json(err));
});

router.route('/').get(ensureAuthenticated, (req, res) => {
  let client = req.body.client;
  console.log(client);
  Client.findById(client, {}, (err) => {
    if (err) {
      console.log(err);
      return res.status(400).send('client not found');
    }
  }).then((client) => res.json(client));
});

router.route('/logout').get((req, res) => {
  req.logout();
  res.redirect('/');
});

router.use((req, res, next) => {
  res.status(404).type('text').send('Not Found');
});

module.exports = router;
