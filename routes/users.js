const router = require('express').Router();

const { updateProfileValidation } = require('../validation/requestValidation');

const {
  getCurrentUser,
  updateProfile,
} = require('../controllers/users');

router.get('/me', getCurrentUser);

router.patch('/me', updateProfileValidation, updateProfile);

module.exports.userRouter = router;
