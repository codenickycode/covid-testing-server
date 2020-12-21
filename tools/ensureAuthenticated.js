const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.status(401).send('unsuccessful');
};

module.exports = ensureAuthenticated;
