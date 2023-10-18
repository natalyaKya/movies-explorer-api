const { celebrate, Joi } = require('celebrate');
const { regularLink } = require('../utils/regular');

const validationCreateMovie = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().regex(regularLink),
    trailerLink: Joi.string().required().regex(regularLink),
    thumbnail: Joi.string().required().regex(regularLink),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
});

const validationDeleteMovie = celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().length(24).hex(),
  }),
});

const validationReturnCurrentUser = celebrate({
  body: Joi.object().keys({
    _id: Joi.string().length(24).hex().required(),
  }),
});

const validationUpdateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().required().email(),
  }),
});

const validationLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

const validationCreateUser = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30).required(),
  }),
});

module.exports = {
  validationCreateMovie,
  validationDeleteMovie,
  validationReturnCurrentUser,
  validationUpdateUser,
  validationLogin,
  validationCreateUser,
};
