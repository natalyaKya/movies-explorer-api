const routerUser = require('express').Router();
const {
  returnCurrentUser,
  updateUser,
} = require('../controllers/users');
const {
  validationReturnCurrentUser,
  validationUpdateUser,
} = require('../middlewares/validation');

routerUser.get('/me', validationReturnCurrentUser, returnCurrentUser);
routerUser.patch('/me', validationUpdateUser, updateUser);

module.exports = routerUser;
