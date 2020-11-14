const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

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
      text: Joi.string().min(250).max(2500),
      source: Joi.string().uri(),
      link: Joi.string(),
      image: Joi.string().uri(),
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
