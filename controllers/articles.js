const Article = require('../models/article.js');
const NotFoundError = require('../errors/not-found-err.js');
const ServerError = require('../errors/server-err.js');
const BadRequestError = require('../errors/bad-request-err.js');
const ForbiddenError = require('../errors/forbidden-error.js');

const getArticles = (req, res, next) => Article.find({})
  .then((data) => {
    if (!data) {
      throw new NotFoundError('Статьи не найдены');
    }
    res.status(200).send(data);
  })
  .catch(next);

const postArticle = (req, res, next) => {
  const articleToPost = {
    keyword: req.body.keyword,
    title: req.body.title,
    text: req.body.text,
    source: req.body.source,
    link: req.body.link,
    image: req.body.image,
    owner: req.user,
  };
  Article.create(articleToPost)
    .then((article) => res.status(200).send(article))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError('Переданы некорректные данные');
      } else {
        throw new ServerError('Произошла ошибка на сервере');
      }
    })
    .catch(next);
};

const deleteArticle = (req, res, next) => {
  Article.findById(req.params.articleId)
    .orFail(new Error('Not found'))
    .then((article) => {
      // eslint-disable-next-line eqeqeq
      if (article.owner == req.user._id) {
        Article.findByIdAndRemove(req.params.articleId)
          .then(() => res.status(200).send({ message: 'Статья удалена' }))
          .catch(() => { throw new ServerError('Произошла ошибка на сервере'); });
      } else { throw new ForbiddenError('Вы пытаетесь удалить чужую карточку'); }
    })
    .catch((err) => {
      if (err.message === 'Not found') { res.status(404).send({ message: 'Запрашиваемая карточка не найдена' }); } else { throw new ServerError('Произошла ошибка на сервере'); }
    })
    .catch(next);
};

module.exports = {
  getArticles,
  postArticle,
  deleteArticle,
};
