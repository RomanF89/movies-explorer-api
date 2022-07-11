const jwt = require('jsonwebtoken');
const { BadAuthError } = require('../errors/badAuthError');

const { NODE_ENV, JWT_SECRET } = process.env;

const authorization = (req, res, next) => {
  const token = req.cookies.jwt;
  let payload;
  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    next(new BadAuthError('Need authorization'));
  }
  req.user = payload;

  next();
};

module.exports = {
  authorization,
};
