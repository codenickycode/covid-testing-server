const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 mins
  max: 10, // max per windowMs
});

const regLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1hr
  max: 5,
  message: 'You have exceded the rate limit for new accounts.',
});

module.exports = { limiter, regLimiter };
