const Article = require('../models/article.js');
const NotFoundError = require('../errors/not-found-err.js');
const ServerError = require('../errors/server-err.js');
const BadRequestError = require('../errors/bad-request-err.js');
const ForbiddenError = require('../errors/forbidden-error.js');
const {
  ERR_ARTICLES_NOT_FOUND,
  ERR_BAD_REQUEST_DATA,
  ERR_SERVER_ERROR,
  MESSAGE_CARD_NOT_FOUND,
  MESSAGE_ARTICLE_DELETED,
  ERR_NOT_FOUND,
  ERR_FORBIDDEN_CARD,
} = require('../utils/constants.js');

const getArticles = (req, res, next) => Article.find({})
  .then((data) => {
    if (!data) {
      throw new NotFoundError(ERR_ARTICLES_NOT_FOUND);
    }
    res.send(data);
  })
  .catch(next);

const postArticle = (req, res, next) => {
  const articleToPost = {
    date: req.body.date,
    keyword: req.body.keyword,
    title: req.body.title,
    text: req.body.text,
    source: req.body.source,
    link: req.body.link,
    image: req.body.image,
    owner: req.user,
  };
  Article.create(articleToPost)
    .then((article) => res.send(article))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError(ERR_BAD_REQUEST_DATA);
      } else {
        throw new ServerError(ERR_SERVER_ERROR);
      }
    })
    .catch(next);
};

const deleteArticle = (req, res, next) => {
  Article.findById(req.params.articleId)
    .orFail(new Error(ERR_NOT_FOUND))
    .then((article) => {
      if (article.owner.equals(req.user._id)) {
        Article.findByIdAndRemove(req.params.articleId)
          .then(() => res.send({ message: MESSAGE_ARTICLE_DELETED }))
          .catch(() => { throw new ServerError(ERR_SERVER_ERROR); });
      } else { throw new ForbiddenError(ERR_FORBIDDEN_CARD); }
    })
    .catch((err) => {
      if (err.message === ERR_FORBIDDEN_CARD) {
        throw new ForbiddenError(ERR_FORBIDDEN_CARD);
      }
      if (err.message === ERR_NOT_FOUND) {
        throw new NotFoundError(MESSAGE_CARD_NOT_FOUND);
      } else { throw new ServerError(ERR_SERVER_ERROR); }
    })
    .catch(next);
};

module.exports = {
  getArticles,
  postArticle,
  deleteArticle,
};
