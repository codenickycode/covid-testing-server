const passport = require('passport');
const bcrypt = require('bcrypt');
const LocalStrategy = require('passport-local');
const ObjectID = require('mongodb').ObjectID;

const localStrategy = (err, user, password, done) => {
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
  passport.use(
    'clientLocal',
    new LocalStrategy((email, password, done) => {
      Client.findOne({ email }, localStrategy(err, user, password, done));
    })
  );

  passport.use(
    'providerLocal',
    new LocalStrategy((email, password, done) => {
      Provider.findOne({ email }, localStrategy(err, user, password, done));
    })
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser((id, done) => {
    collection.findOne({ _id: new ObjectID(id) }, (err, doc) => {
      if (err) console.log(err);
      done(null, doc);
    });
  });
};
