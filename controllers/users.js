const User = require('../models/user.js');
const ServerError = require('../errors/server-err.js');
const NotFoundError = require('../errors/not-found-err.js');
const {
  ERR_CURRENT_USER_NOT_EXISTS,
  ERR_NOT_FOUND,
  ERR_SERVER_ERROR,
} = require('../utils/constants.js');

const getMe = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(new Error(ERR_NOT_FOUND))
    .then((data) => res.status(200).send(data))
    .catch((err) => {
      if (err.message == ERR_NOT_FOUND) {
        throw new NotFoundError(ERR_CURRENT_USER_NOT_EXISTS);
      } else { throw new ServerError(ERR_SERVER_ERROR); }
    })
    .catch(next);
};

module.exports = {
  getMe,
};
