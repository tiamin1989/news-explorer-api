const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const { errors } = require('celebrate');
const { requestLogger, errorLogger } = require('./middlewares/logger.js');
const { auth } = require('./middlewares/auth.js');
const { errorHandler } = require('./middlewares/error-handler.js');
const NotFoundError = require('./errors/not-found-err.js');
const { devMongoDB, devPort } = require('./utils/dev-config.js');
const {
  limiter,
  ERR_PAGE_NOT_FOUND,
} = require('./utils/constants.js');

const app = express();

app.use(helmet({
  contentSecurityPolicy: false,
  hsts: false,
}));

mongoose.connect(process.env.DB_CONN ? process.env.DB_CONN : devMongoDB, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

const usersRouter = require('./routes/users.js').router;
const articlesRouter = require('./routes/articles.js').router;
const testsRouter = require('./routes/tests.js').router;
const signInRouter = require('./routes/sign-in.js').router;
const signUpRouter = require('./routes/sign-up.js').router;

app.use(limiter);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true,
}));

app.use(cors());
app.options('*', cors());

app.use(requestLogger);

app.use(testsRouter);

app.use(signInRouter);

app.use(signUpRouter);

app.use(auth);

app.use(usersRouter);
app.use(articlesRouter);

app.use('/*', () => {
  throw new NotFoundError(ERR_PAGE_NOT_FOUND);
});

app.use(errorLogger);

app.use(errors());

app.use(errorHandler);

app.listen(process.env.PORT ? process.env.PORT : devPort, () => {
  console.log(`Приложение запущено в режиме ${process.env.NODE_ENV ? process.env.NODE_ENV : 'development'}, порт: ${process.env.PORT ? process.env.PORT : devPort}`);
});
