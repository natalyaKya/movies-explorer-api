const router = require('express').Router();
const rateLimit = require('express-rate-limit');
const routerUser = require('./users');
const routerMovie = require('./movies');

const NotFoundError = require('../errors/not-found-err');

const limiter = rateLimit({ windowMs: 10 * 60 * 1000, max: 100 });

router.use(limiter);
router.use(routerUser);
router.use(routerMovie);
router.use((req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

module.exports = router;
