const Movie = require('../models/movie');

const NotFoundError = require('../errors/not-found-err');
const ForbiddenError = require('../errors/forbidden-err');

module.exports.returnMovies = (req, res, next) => {
  const { _id } = req.user;
  Movie.find({ owner: _id })
    .then((movies) => res.send(movies))
    .catch(next);
};

module.exports.createMovie = (req, res, next) => {
  const movieInfo = req.body;
  const owner = req.user._id;
  Movie.create({ ...movieInfo, owner })
    .then((movie) => { res.status(201).send(movie); })
    .catch(next);
};

module.exports.deleteMovieBiId = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .orFail(new NotFoundError(`Фильм с таким _id ${req.params.movieId} не найден`))
    .then((movie) => {
      if (JSON.stringify(req.user._id) !== JSON.stringify(movie.owner)) {
        return next(new ForbiddenError('Пользователь не может  удалять фильмы других пользователей'));
      }
      return Movie.findByIdAndRemove(req.params.movieId)
        .then(() => {
          res.status(200).send(movie);
        })
        .catch(next);
    })
    .catch(next);
};
