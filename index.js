const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors, celebrate, Joi } = require('celebrate');
const { requestLogger, errorLogger } = require('./middlewares/logger.js');
const { postLoginData, postNewUser } = require('./controllers/auth.js');
const auth = require('./middlewares/auth.js');
const NotFoundError = require('./errors/not-found-err.js');
const { devMongoDB, devPort } = require('./utils/dev-config.js');
const {
  limiter,
  ERR_SERVER_DOWN,
  ERR_PAGE_NOT_FOUND,
  ERR_SERVER_ERROR,
} = require('./utils/constants.js');

const app = express();

mongoose.connect(process.env.DB_CONN ? process.env.DB_CONN : devMongoDB, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
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
    throw new Error(ERR_SERVER_DOWN);
  }, 0);
});

app.post('/signin', celebrate({
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

app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string()
      .email()
      .required(),
    password: Joi.string()
      .regex(/[^-\s]/)
      .required()
      .min(8),
  }).unknown(true),
}), postNewUser);

app.use(auth);

app.use(usersRouter);
app.use(articlesRouter);

app.use('/*', () => {
  throw new NotFoundError(ERR_PAGE_NOT_FOUND);
});

app.use(errorLogger);

app.use(errors());

app.use((err, req, res) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({ message: statusCode === 500 ? ERR_SERVER_ERROR : message });
});

app.listen(process.env.PORT ? process.env.PORT : devPort, () => {
  console.log(`Приложение запущено в режиме ${process.env.NODE_ENV ? process.env.NODE_ENV : 'development'}, порт: ${process.env.PORT ? process.env.PORT : devPort}`);
});
