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
