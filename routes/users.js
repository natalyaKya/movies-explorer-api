const routerUser = require('express').Router();
const {
  returnCurrentUser,
  updateUser,
  login,
  createUser,
  logout,
} = require('../controllers/users');
const {
  validationReturnCurrentUser,
  validationUpdateUser,
  validationLogin,
  validationCreateUser,
} = require('../middlewares/validation');
const auth = require('../middlewares/auth');

routerUser.post('/signin', validationLogin, login);
routerUser.post('/signup', validationCreateUser, createUser);
routerUser.get('/signout', auth, logout);

routerUser.use('/users', auth, routerUser);
routerUser.get('users/me', validationReturnCurrentUser, auth, returnCurrentUser);
routerUser.patch('users/me', validationUpdateUser, auth, updateUser);

module.exports = routerUser;
