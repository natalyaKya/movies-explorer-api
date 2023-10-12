const jwttoken = require('jsonwebtoken');
const UnauthorizedError = require('../errors/unauthor-err');
const { JWT_SECRET_KEY } = require('../utils/constants');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const { jwt } = req.cookies;
  if (!jwt) {
    return next(new UnauthorizedError('Необходима авторизация'));
  }

  const token = jwt;
  let payload;

  try {
    payload = jwttoken.verify(token, NODE_ENV === 'production' ? JWT_SECRET : JWT_SECRET_KEY);
  } catch (err) {
    return next(new UnauthorizedError('Необходима авторизация'));
  }
  req.user = payload;
  return next();
};

