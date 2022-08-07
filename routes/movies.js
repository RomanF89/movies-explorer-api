const router = require('express').Router();

const {
  createMovieValidation,
  deleteMovieValidation,
} = require('../validation/requestValidation');

const {
  getMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/movies');

router.get('/', getMovies);

router.post('/', createMovieValidation, createMovie);

router.delete('/:movieId', deleteMovieValidation, deleteMovie);

module.exports.movieRouter = router;
