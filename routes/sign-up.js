const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { postNewUser } = require('../controllers/auth.js');

router.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string()
      .regex(/[^-\s]/)
      .min(2)
      .max(30)
      .required(),
    email: Joi.string()
      .email()
      .required(),
    password: Joi.string()
      .regex(/[^-\s]/)
      .required()
      .min(8),
  }).unknown(true),
}), postNewUser);

module.exports = {
  router,
};
