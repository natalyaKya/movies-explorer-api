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

router.post('/signin', validationLogin, login);
router.post('/signup', validationCreateUser, createUser);
router.use(cookieParser());
router.use(auth);
router.get('/signout', logout);
router.use('/users', routerUser);
router.use('/movies', routerMovie);

module.exports = router;
