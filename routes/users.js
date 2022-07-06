const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const validation = require('validator');

const {
  getCurrentUser,
  updateProfile,
} = require('../controllers/users');

router.get('/me', getCurrentUser);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    email: Joi.string().required().custom((value, helpers) => {
      if (validation.isEmail(value)) {
        return value;
      }
      return helpers.error('any.invalid');
    }),
  }),
}), updateProfile);

module.exports.userRouter = router;
