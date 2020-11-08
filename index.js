const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
/* const { PORT = 3000 } = process.env; */
const auth = require('./middlewares/auth.js');
const { requestLogger, errorLogger } = require('./middlewares/logger.js');
const { errors, celebrate, Joi } = require('celebrate');
const { postLoginData, postNewUser } = require('./controllers/auth.js');
const rateLimit = require("express-rate-limit");
require('dotenv').config();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

mongoose.connect(process.env.DB_CONN, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false
});

const usersRouter = require('./routes/users.js').router;
const articlesRouter = require('./routes/articles.js').router;

app.use(limiter);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true,
}));

app.use(cors());
app.options('*', cors());

app.use(requestLogger);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string()
      .email()
      .required(),
    password: Joi.string()
      .alphanum()
      .required()
      .min(8),
  }).unknown(true),
}), postLoginData);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string()
      .email()
      .required(),
    password: Joi.string()
      .alphanum()
      .required()
      .min(8),
  }).unknown(true),
}), postNewUser);

app.use(auth);

app.use(usersRouter);
app.use(articlesRouter);

app.use('/*', () => {
  throw new NotFoundError('Страница не найдена');
});

app.use(errorLogger);

app.use(errors());

app.use((err, req, res) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({ message: statusCode === 500 ? 'На сервере произошла ошибка' : message });
});

app.listen(process.env.PORT, () => {
  console.log(`Приложение запущено, порт: ${process.env.PORT}`);
});
