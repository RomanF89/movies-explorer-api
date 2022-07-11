const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const { NotFoundError } = require('../errors/notFoundError');
const { BadRequestError } = require('../errors/badRequestError');
const { BadAuthError } = require('../errors/badAuthError');
const { ConflictingRequestError } = require('../errors/conflictingRequestError');

const { NODE_ENV, JWT_SECRET } = process.env;

const createUser = (req, res, next) => {
  const { name, email, password } = req.body;

  return bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      email,
      password: hash,
    }))
    .then((user) => {
      const resUser = user.toObject();
      delete resUser.password;
      res.status(201).send(resUser);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const fields = Object.keys(err.errors).join(', ');
        next(new BadRequestError(`${fields} are not correct`));
      } else if (err.code === 11000) {
        next(new ConflictingRequestError('This email already exists'));
      } else {
        next(err);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return next(new BadAuthError('email or password are incorrect'));
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return next(new BadAuthError('email or password are incorrect'));
          }
          return user;
        });
    })
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
      res.cookie('jwt', token, {
        maxAge: 360000 * 24 * 7,
        httpOnly: true,
        sameSite: true,
      });
      res.send({ message: 'Success' })
        .end();
    })
    .catch((err) => {
      next(err);
    });
};

const getCurrentUser = (req, res, next) => {
  const currentUser = req.user._id;

  return User.findById(currentUser)
    .then((user) => {
      if (!user) {
        next(new NotFoundError('User not found'));
      }
      const resUser = user.toObject();
      delete resUser.password;
      res.send(resUser);
    })
    .catch((err) => {
      next(err);
    });
};

const updateProfile = (req, res, next) => {
  const currentUser = req.user._id;
  const userEmail = req.body.email;
  const userName = req.body.name;

  return User.findByIdAndUpdate(currentUser, { name: userName, email: userEmail }, {
    new: true, runValidators: true,
  })
    .then((userData) => {
      const resUser = userData.toObject();
      delete resUser.password;
      res.send(resUser);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const fields = Object.keys(err.errors).join(', ');
        next(new BadRequestError(`${fields} are not correct`));
      } else if (err.code === 11000) {
        next(new ConflictingRequestError('This email already exists'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  createUser,
  login,
  updateProfile,
  getCurrentUser,
};
