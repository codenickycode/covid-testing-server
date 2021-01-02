const router = require('express').Router();
const passport = require('passport');
const ensureAuthenticated = require('../../tools/ensureAuthenticated.js');
const reqs = require('./reqs/commonReqs');
const { regLimiter } = require('../../rateLimiter');

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
router.route('/locations').get(reqs.getLocations);

// add distance from origin to all locations
router.route('/distances').post(reqs.getDistances);

// register new user
router.route('/register').post(regLimiter, reqs.registerUser);

// get, add, and delete user appointments
router
  .route('/appointments')
  .get(ensureAuthenticated, reqs.getAppointments)
  .post(ensureAuthenticated, reqs.addAppointment)
  .delete(ensureAuthenticated, reqs.deleteAppointment);

// update user profile
router.route('/update/:type').post(ensureAuthenticated, reqs.updateProfile);

// get user document
router.route('/').get(ensureAuthenticated, reqs.getClient);

// catch all invalid endpoints
router.use((req, res, next) => {
  res.status(404).send('Not Found');
});

module.exports = router;
