const { logger } = require('./logger');
const passport = require('passport');
const bcrypt = require('bcrypt');
const LocalStrategy = require('passport-local');
const ObjectID = require('mongodb').ObjectID;
const User = require('./models/User.model');

module.exports = () => {
  // local strategy for passport
  passport.use(
    'local',
    new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
      User.findOne({ email: { email } }, (e, user) => {
        if (e) {
          logger.error(`auth.js Passport Local => ${e.stack}`);
          return done(e);
        }
        if (!user) {
          return done(null, false);
        }
        if (!bcrypt.compareSync(password, user.password)) {
          return done(null, false);
        }
        return done(null, user);
      });
    })
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser((req, id, done) => {
    User.findOne({ _id: new ObjectID(id) }, (e, doc) => {
      if (e) logger.error(`auth.js Passport deserialize => ${e.stack}`);
      done(null, doc);
    });
  });
};
