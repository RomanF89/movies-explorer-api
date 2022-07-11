const errorsHandler = ((err, req, res, next) => {
  console.log(next);
  if (err.statusCode) {
    return res.status(err.statusCode).send({ message: err.message });
  }
  return res.status(500).send({ message: 'Server error' });
});

module.exports = errorsHandler;
