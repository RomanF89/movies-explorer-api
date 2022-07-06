const Movie = require('../models/Movie');

const { NotFoundError } = require('../errors/notFoundError');
const { BadRequestError } = require('../errors/badRequestError');
const { ForbiddenError } = require('../errors/forbiddenError');

const getMovies = (req, res, next) => {
  const userId = req.user._id;

  return Movie.find({ owner: userId })
    .then((moviesData) => {
      if (!moviesData) {
        next(new NotFoundError('Movies not found'));
      }
      res.send(moviesData);
    })
    .catch((err) => {
      next(err);
    });
};

const createMovie = (req, res, next) => {
  const owner = req.user._id;

  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;

  return Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink: trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner,
  })
    .then((movieData) => {
      if (!movieData) {
        next(new BadRequestError('Movie data is not correct'));
      }
      res.status(201).send(movieData);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const fields = Object.keys(err.errors).join(', ');
        next(new BadRequestError(`${fields} are not correct`));
      }
      next(err);
    });
};

const deleteMovie = (req, res, next) => {
  const { movieId } = req.params;
  const user = req.user._id;

  Movie.findOne({ _id: movieId })
    .then((movie) => {
      if (!movie) {
        return next(new NotFoundError('Movie not found'));
      }
      if (movie.owner.toString() === user) {
        return Movie.findByIdAndRemove(movieId)
          .then((deletedMovie) => {
            res.send({ message: `${deletedMovie.nameRU} deleted` });
          });
      }
      return next(new ForbiddenError('You are not movie owner'));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Card id is not correct'));
      }
      next(err);
    });
};

module.exports = {
  getMovies,
  createMovie,
  deleteMovie,
};
