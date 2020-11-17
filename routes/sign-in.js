const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { postLoginData } = require('../controllers/auth.js');

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string()
      .email()
      .required(),
    password: Joi.string()
      .regex(/[^-\s]/)
      .required()
      .min(8),
  }).unknown(true),
}), postLoginData);

module.exports = {
  router,
};
