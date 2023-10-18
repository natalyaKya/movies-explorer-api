const router = require('express').Router();
const cookieParser = require('cookie-parser');
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

router.post('/signin', validationLogin, login);
router.post('/signup', validationCreateUser, createUser);
router.use(cookieParser());
router.get('/signout', auth, logout);
router.use('/users', auth, routerUser);
router.use('/movies', auth, routerMovie);
router.all('*', (req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

module.exports = router;
