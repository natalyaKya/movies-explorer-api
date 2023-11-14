const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const NotFoundError = require('../errors/not-found-err');
const UnauthorizedError = require('../errors/unauthor-err');
const DublicateError = require('../errors/dublicate-err');
const ValidationError = require('../errors/validation-err');
const { JWT_SECRET_KEY } = require('../utils/constants');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.returnCurrentUser = (req, res, next) => {
  const { _id } = req.user;
  User.findOne({ _id })
    .orFail(new NotFoundError(`Пользователь с таким _id ${req.user._id} не найден`))
    .then((user) => {
      res.send({
        name: user.name,
        email: user.email,
      });
    })
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const {
    name,
    email,
  } = req.body;
  bcrypt.hash(req.body.password, 10)
    .then((hash) => {
      User.create({
        name,
        email,
        password: hash,
      })
        .then((user) => res.status(201).send({
          _id: user._id,
          name: user.name,
          email: user.email,
        }))
        .catch((err) => {
          if (err.code === 11000) return next(new DublicateError('Пользователь с таким e-mail уже зарегистрирован'));
          return next(err);
        });
    })
    .catch(next);
};

module.exports.updateUser = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, email }, {
    new: true,
    runValidators: true,
  })
    .orFail(new NotFoundError('Такого пользователя не существует'))
    .then((user) => {
      res.send({
        name: user.name,
        email: user.email,
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new ValidationError('Некорректные данные'));
      }
      if (err.code === 11000) {
        return next(new DublicateError('Пользователь с таким e-mail уже зарегистрирован'));
      }
      return next(err);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return next(new UnauthorizedError('Неверные логин или пароль'));
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return next(new UnauthorizedError('Неверные логин или пароль'));
          }
          const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : JWT_SECRET_KEY, { expiresIn: '7d' });
          return res.cookie('jwt', token, { httpOnly: true })
            .send({
              name: user.name,
              email: user.email,
            }).end();
        });
    })
    .catch(next);
};

module.exports.logout = (req, res) => {
  res.clearCookie('jwt')
    .send({ message: 'Куки удалены' }).end();
};
