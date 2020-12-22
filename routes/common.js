const { logger } = require('../logger');
const express = require('express');
const router = express.Router();
const passport = require('passport');
const ensureAuthenticated = require('../tools/ensureAuthenticated.js');
const User = require('../models/User.model.js');
const Location = require('../models/Location.model.js');
const registerPost = require('./reqs/registerPost.js');
const getAppointments = require('./reqs/getAppointments.js');
const addAppointment = require('./reqs/addAppointment.js');
const deleteAppointment = require('./reqs/deleteAppointment.js');
const updateProfile = require('./reqs/updateProfile.js');

// user login
router
  .route('/login')
  .post(passport.authenticate('local'), (req, res, next) => {
    res.status(200).send('Success!');
  });

// user logout
router.route('/logout').get((req, res) => {
  req.logout();
  res.status(200).send('You have successfully logged out.');
});

// return all locations
router.route('/locations').get((req, res) => {
  Location.find()
    .then((locations) => res.json(locations))
    .catch((e) => {
      logger.error(`/locations => \n ${e.stack}`);
      return res.status(500).send('An error occurred. Please try again later.');
    });
});

// register new user
router.route('/register').post((req, res) => registerPost(req, res));

// get, add, and delete client appointments
router
  .route('/appointments')
  .get(ensureAuthenticated, (req, res) => getAppointments(req, res))
  .post(ensureAuthenticated, (req, res) => addAppointment(req, res))
  .delete(ensureAuthenticated, (req, res) => deleteAppointment(req, res));

// update client profile
router
  .route('/update/:type')
  .post(ensureAuthenticated, (req, res) => updateProfile(req, res));

// get client document
router.route('/').get(ensureAuthenticated, (req, res) => {
  User.findById(req.user._id)
    .then((client) => res.status(200).json(client))
    .catch((e) => {
      logger.error(`/locations => \n ${e.stack}`);
      return res.status(500).send('An error occurred. Please try again later.');
    });
});

// catch all invalid endpoints
router.use((req, res, next) => {
  res.status(404).send('Not Found');
});

module.exports = router;
