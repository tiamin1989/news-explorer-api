const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const UnauthorizedError = require('../errors/unauthorized-err.js');
const ConflictError = require('../errors/conflict-err.js');
const ServerError = require('../errors/server-err.js');
const BadRequestError = require('../errors/bad-request-err.js');
const { devJWT, devSalt } = require('../utils/dev-config.js');
const {
  ERR_USER_EXISTS,
  ERR_SERVER_ERROR,
  ERR_BAD_REQUEST_DATA,
  ERR_EMAIL_PASSWORD_WRONG,
} = require('../utils/constants.js');

const postNewUser = (req, res, next) => {
  const { email, password, name } = req.body;
  User.findOne({ email })
    .then((findedUser) => {
      if (findedUser) {
        throw new ConflictError(ERR_USER_EXISTS);
      }
      bcrypt.hash(password,
        process.env.SALT_ROUNDS ? Number(process.env.SALT_ROUNDS) : devSalt,
        (error, hash) => {
          if (error) {
            throw new ServerError(ERR_SERVER_ERROR);
          }
          User.create({ email, password: hash, name })
            .then((user) => {
              res.send({
                name: user.name,
                _id: user._id,
                email: user.email,
              });
            })
            .catch((err) => {
              if (err.name === 'ValidationError') {
                throw new BadRequestError(ERR_BAD_REQUEST_DATA);
              } else {
                throw new ServerError(ERR_SERVER_ERROR);
              }
            })
            .catch(next);
        });
    })
    .catch(next);
};

const postLoginData = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError(ERR_EMAIL_PASSWORD_WRONG);
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new UnauthorizedError(ERR_EMAIL_PASSWORD_WRONG);
          }
          const token = jwt.sign(
            { _id: user._id },
            process.env.JWT_SECRET ? process.env.JWT_SECRET : devJWT,
            { expiresIn: '7d' },
          );
          res.send({ _id: user._id, token });
        })
        .catch(next);
    })
    .catch(next);
};

module.exports = {
  postNewUser,
  postLoginData,
};
