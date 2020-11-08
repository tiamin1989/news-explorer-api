const User = require('../models/user.js');
const ServerError = require('../errors/server-err.js');
const NotFoundError = require('../errors/not-found-err.js');

const getMe = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(new Error('Not found'))
    .then((data) => res.status(200).send(data))
    .catch((err) => {
      if (err.message === 'Not found') { throw new NotFoundError('Пользователь не найден'); } else { throw new ServerError('Произошла ошибка на сервере'); }
    })
    .catch(next);
};

module.exports = {
  getMe,
};
