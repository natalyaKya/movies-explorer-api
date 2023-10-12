const routerMovie = require('express').Router();
const {
  returnMovies,
  createMovie,
  deleteMovieBiId,
} = require('../controllers/movies');
const { validationCreateMovie, validationDeleteMovie } = require('../middlewares/validation');

routerMovie.get('/', returnMovies);
routerMovie.post('/', validationCreateMovie, createMovie);
routerMovie.delete('/:movieId', validationDeleteMovie, deleteMovieBiId);

module.exports = routerMovie;
