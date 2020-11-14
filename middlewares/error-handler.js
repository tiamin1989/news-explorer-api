const {
  ERR_SERVER_ERROR,
} = require('../utils/constants.js');

const errorHandler = (err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({ message: statusCode === 500 ? ERR_SERVER_ERROR : message });
  next();
};

module.exports = {
  errorHandler,
};
