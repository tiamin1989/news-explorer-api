const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

const ERR_SERVER_DOWN = 'Сервер сейчас упадёт';
const ERR_PAGE_NOT_FOUND = 'Страница не найдена';
const ERR_SERVER_ERROR = 'На сервере произошла ошибка';
const ERR_BAD_REQUEST_DATA = 'Переданы некорректные данные';
const ERR_NOT_FOUND = 'Не найдено';

const ERR_ARTICLES_NOT_FOUND = 'Статьи не найдены';
const ERR_FORBIDDEN_CARD = 'Вы пытаетесь удалить чужую карточку';
const ERR_USER_EXISTS = 'Данный пользователь уже зарегистрирован';
const ERR_USER_NOT_EXISTS = 'Нет пользователя с таким email';
const ERR_CURRENT_USER_NOT_EXISTS = 'Пользователь не найден';
const ERR_EMAIL_PASSWORD_WRONG = 'Неправильная почта или пароль';

const MESSAGE_CARD_NOT_FOUND = 'Запрашиваемая карточка не найдена';
const MESSAGE_ARTICLE_DELETED = 'Статья удалена';
const MESSAGE_NEED_AUTHORIZATION = 'Необходима авторизация';
const MESSAGE_WRONG_ARTICLE_SOURCE_URL = 'Неправильная ссылка на источник статьи';
const MESSAGE_WRONG_INTERNAL_ARTICLE_URL = 'Неправильная внутренняя ссылка для статьи';
const MESSAGE_WRONG_IMAGE_URL = 'Неправильная ссылка для картинки';
const MESSAGE_WRONG_EMAIL = 'Неправильный email';

module.exports = {
  limiter,
  ERR_SERVER_DOWN,
  ERR_PAGE_NOT_FOUND,
  ERR_SERVER_ERROR,
  ERR_ARTICLES_NOT_FOUND,
  ERR_BAD_REQUEST_DATA,
  ERR_FORBIDDEN_CARD,
  MESSAGE_CARD_NOT_FOUND,
  MESSAGE_ARTICLE_DELETED,
  ERR_USER_EXISTS,
  ERR_USER_NOT_EXISTS,
  ERR_EMAIL_PASSWORD_WRONG,
  ERR_CURRENT_USER_NOT_EXISTS,
  ERR_NOT_FOUND,
  MESSAGE_NEED_AUTHORIZATION,
  MESSAGE_WRONG_ARTICLE_SOURCE_URL,
  MESSAGE_WRONG_INTERNAL_ARTICLE_URL,
  MESSAGE_WRONG_IMAGE_URL,
  MESSAGE_WRONG_EMAIL,
};
