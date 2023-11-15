const routerMovie = require('express').Router();
const {
  returnMovies,
  createMovie,
  deleteMovieBiId,
} = require('../controllers/movies');
const auth = require('../middlewares/auth');
const { validationCreateMovie, validationDeleteMovie } = require('../middlewares/validation');

routerMovie.get('/movies', auth, returnMovies);
routerMovie.post('/movies', auth, validationCreateMovie, createMovie);
routerMovie.delete('/movies/:movieId', auth, validationDeleteMovie, deleteMovieBiId);

module.exports = routerMovie;
