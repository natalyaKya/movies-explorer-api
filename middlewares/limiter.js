const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 100,
  message: 'Too many requests',
});

module.exports = limiter;
