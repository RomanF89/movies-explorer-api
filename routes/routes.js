const router = require('express').Router();
const { userRouter } = require('./users');
const { movieRouter } = require('./movies');
const { authorization } = require('../middlewares/authorization');
const { NotFoundError } = require('../errors/notFoundError');

const {
  signinValidation,
  signupValidation,
} = require('../validation/requestValidation');

const {
  createUser,
  login,
} = require('../controllers/users');

router.post('/signup', signupValidation, createUser);

router.post('/signin', signinValidation, login);

router.use((req, res, next) => {
  res.status(404).send({ message: `${req.originalUrl} is not exist` });
  next(new NotFoundError("Sorry can't find that!"));
});

// router.use(authorization);

router.post('/signout', (req, res) => {
  res.clearCookie('jwt').send({ message: 'Выход' });
});

router.use('/users', userRouter);

router.use('/movies', movieRouter);

module.exports = router;
