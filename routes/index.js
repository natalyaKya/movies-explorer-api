const router = require('express').Router();
const rateLimit = require('express-rate-limit');
const routerUser = require('./users');
const routerMovie = require('./movies');
const auth = require('../middlewares/auth');
const {
  login,
  createUser,
  logout,
} = require('../controllers/users');
const { validationLogin, validationCreateUser } = require('../middlewares/validation');
const NotFoundError = require('../errors/not-found-err');

const limiter = rateLimit({ windowMs: 10 * 60 * 1000, max: 100 });
router.use(limiter);
router.post('/signin', validationLogin, login);
router.post('/signup', validationCreateUser, createUser);
router.get('/signout', auth, logout);
router.use('/users', auth, routerUser);
router.use('/movies', auth, routerMovie);
router.all('*', (req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

module.exports = router;
