const express = require('express');
const router = express.Router();
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
  const newClient = new Client(req.body);
  Client.findOne({ email: newClient.email })
    .then((client) => {
      if (client) {
        return res.send(false);
      } else {
        newClient
          .save()
          .then(() => res.send('success'))
          .catch((err) => res.status(400).json(err));
      }
    })
    .catch((err) => res.status(400).json(err));
});

// find client in db and return client info
router.route('/login').post((req, res) => {
  const { email, password } = req.body;
  Client.findOne({ email })
    .then((client) => {
      if (!client) {
        return res.send('invalid email');
      } else if (password !== client.password) {
        return res.send('invalid password');
      } else {
        return res.json(client);
      }
    })
    .catch((err) => res.status(400).json(err));
});

// add an appointment
router.route('/appointments').post(async (req, res) => {
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

router.route('/appointments').get(async (req, res) => {
  const client = req.body.client;
  const clientDoc = await Client.findById(client, {}, (err) => {
    if (err) return res.status(400).send('client not found');
  });
  return res.json(clientDoc.appointments);
});

router.route('/appointments').delete(async (req, res) => {
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

router.route('/update/:type').post(async (req, res) => {
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

router.route('/').get((req, res) => {
  let client = req.body.client;
  console.log(client);
  Client.findById(client, {}, (err) => {
    if (err) {
      console.log(err);
      return res.status(400).send('client not found');
    }
  }).then((client) => res.json(client));
});

module.exports = router;
