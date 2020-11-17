const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getMe,
} = require('../controllers/users');

router.get('/users/me', celebrate({
  headers: Joi.object().keys({
    authorization: Joi.string().required().regex(/Bearer ([A-Za-z.])\w+/),
  }).unknown(true),
}), getMe);

module.exports = {
  router,
};
