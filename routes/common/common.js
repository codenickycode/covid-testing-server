const router = require('express').Router();
const passport = require('passport');
const ensureAuthenticated = require('../../tools/ensureAuthenticated.js');
const reqs = require('./reqs/commonReqs');
const { regLimiter } = require('../../rateLimiter');
const cleanUserJson = require('../../tools/cleanUserJson.js');

// user login
router
  .route('/login')
  .post(passport.authenticate('local'), (req, res, next) => {
    // req.session.user = req.user;
    const response = cleanUserJson(req.user);
    res.status(200).json(response);
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

// register new user *** add regLimter back to middleware
router.route('/register').post(reqs.registerUser);

// get, add, and delete user appointments
router
  .route('/appointments')
  .get(ensureAuthenticated, reqs.getAppointments)
  .post(ensureAuthenticated, reqs.addAppointment)
  .delete(ensureAuthenticated, reqs.deleteAppointment);

// update user profile
router.route('/update/:field').post(ensureAuthenticated, reqs.updateProfile);

// get user document
router.route('/user').get(ensureAuthenticated, reqs.getClient);

// catch all invalid endpoints
router.use((req, res, next) => {
  res.status(404).send('Not Found');
});

module.exports = router;
