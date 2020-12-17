const passport = require('passport');
const bcrypt = require('bcrypt');
const LocalStrategy = require('passport-local');
const ObjectID = require('mongodb').ObjectID;
const Client = require('./models/Client.model');
const Provider = require('./models/Provider.model');

// local strategy for both client and provider
const localStrategy = (err, user, email, password, done) => {
  console.log(email + ' attempted to log in.');
  if (err) {
    return done(err);
  }
  if (!user) {
    return done(null, false);
  }
  if (!bcrypt.compareSync(password, user.password)) {
    return done(null, false);
  }
  return done(null, user);
};

module.exports = () => {
  // client local strategy for passport
  passport.use(
    'clientLocal',
    new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
      Client.findOne({ email }, (err, user) => {
        localStrategy(err, user, email, password, done);
      });
    })
  );

  // provider local strategy for passport
  passport.use(
    'providerLocal',
    new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
      Provider.findOne({ email }, (err, user) => {
        localStrategy(err, user, email, password, done);
      });
    })
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  // if from client endpoint, check client collection
  // if from provider endpoint, check provider collection
  passport.deserializeUser((req, id, done) => {
    let db = req.url.replace(/^\/(\w*).*/, '$1');
    if (db === 'client') {
      Client.findOne({ _id: new ObjectID(id) }, (err, doc) => {
        if (err) console.log(err);
        done(null, doc);
      });
    } else if (db === 'provider') {
      Provider.findOne({ _id: new ObjectID(id) }, (err, doc) => {
        if (err) console.log(err);
        done(null, doc);
      });
    }
  });
};
