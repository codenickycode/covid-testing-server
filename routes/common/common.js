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
router.route('/locations').get((req, res) => reqs.getLocations(req, res));

// register new user
router
  .route('/register')
  .post(regLimiter, (req, res) => reqs.registerPost(req, res));

// get, add, and delete user appointments
router
  .route('/appointments')
  .get(ensureAuthenticated, (req, res) => reqs.getAppointments(req, res))
  .post(ensureAuthenticated, (req, res) => reqs.addAppointment(req, res))
  .delete(ensureAuthenticated, (req, res) => reqs.deleteAppointment(req, res));

// update user profile
router
  .route('/update/:type')
  .post(ensureAuthenticated, (req, res) => reqs.updateProfile(req, res));

// get user document
router
  .route('/')
  .get(ensureAuthenticated, (req, res) => reqs.getClient(req, res));

// catch all invalid endpoints
router.use((req, res, next) => {
  res.status(404).send('Not Found');
});

module.exports = router;
