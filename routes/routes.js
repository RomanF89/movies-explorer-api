const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { userRouter } = require('./users');
const { movieRouter } = require('./movies');
const { authorization } = require('../middlewares/authorization');
const { NotFoundError } = require('../errors/notFoundError');

const {
  createUser,
  login,
} = require('../controllers/users');

router.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), createUser);

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

router.use(authorization);

router.post('/signout', (req, res) => {
  res.clearCookie('jwt').send({ message: 'Выход' });
});

router.use('/users', userRouter);

router.use('/movies', movieRouter);

router.use((req, res, next) => {
  next(new NotFoundError("Sorry can't find that!"));
});

module.exports = router;
