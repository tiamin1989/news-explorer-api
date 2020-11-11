const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-err.js');
const UnauthorizedError = require('../errors/unauthorized-err.js');
const ConflictError = require('../errors/conflict-err.js');
const ServerError = require('../errors/server-err.js');
const BadRequestError = require('../errors/bad-request-err.js');

const SALT_ROUNDS = 10;

const postNewUser = (req, res, next) => {
  const { email, password, name } = req.body;
  User.findOne({ email })
    .then((findedUser) => {
      if (findedUser) {
        throw new ConflictError('Данный пользователь уже зарегистрирован');
      }
      bcrypt.hash(password, SALT_ROUNDS, (error, hash) => {
        if (error) {
          throw new ServerError('Произошла ошибка на сервере');
        }
        User.create({ email, password: hash, name })
          .then((user) => {
            user.password = 'the password you specified';
            res.status(200).send(user);
          })
          .catch((err) => {
            if (err.name === 'ValidationError') {
              throw new BadRequestError('Переданы некорректные данные');
            } else {
              throw new ServerError('Произошла ошибка на сервере');
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
        throw new NotFoundError('Нет пользователя с таким email');
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new UnauthorizedError('Неправильная почта или пароль');
          }
          const token = jwt.sign(
            { _id: user._id },
            process.env.JWT_SECRET ? process.env.JWT_SECRET : 'jwt-secret',
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
