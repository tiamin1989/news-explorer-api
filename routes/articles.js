const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const chrisoValidator = require('validator');
const {
  MESSAGE_WRONG_ARTICLE_SOURCE_URL,
  MESSAGE_WRONG_IMAGE_URL,
} = require('../utils/constants.js');

const {
  getArticles,
  postArticle,
  deleteArticle,
} = require('../controllers/articles');

router.get('/articles', celebrate({
  headers: Joi.object().keys({
    authorization: Joi.string().required().regex(/Bearer ([A-Za-z.])\w+/),
  }).unknown(true),
}), getArticles);

router.post('/articles', celebrate({
  headers: Joi.object().keys({
    authorization: Joi.string().required().regex(/Bearer ([A-Za-z.])\w+/),
    body: Joi.object().keys({
      date: Joi.date(),
      keyword: Joi.string().min(2).max(30),
      title: Joi.string().min(2).max(70),
      text: Joi.string(),
      source: Joi.string(),
      link: Joi.string().uri().custom((value, helpers) => {
        if (chrisoValidator.isURL(value)) return value;
        return helpers.message(MESSAGE_WRONG_ARTICLE_SOURCE_URL);
      }),
      image: Joi.string().uri().custom((value, helpers) => {
        if (chrisoValidator.isURL(value)) return value;
        return helpers.message(MESSAGE_WRONG_IMAGE_URL);
      }),
    }),
  }).unknown(true),
}), postArticle);

router.delete('/articles/:articleId', celebrate({
  headers: Joi.object().keys({
    authorization: Joi.string().required().regex(/Bearer ([A-Za-z.])\w+/),
  }).unknown(true),
  params: Joi.object({
    articleId: Joi.string().required().hex(),
  }).unknown(true),
}), deleteArticle);

module.exports = {
  router,
};
