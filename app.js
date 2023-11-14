require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const { errors } = require('celebrate');
const router = require('./routes/index');
const limiter = require('./middlewares/limiter');
const NotFoundError = require('./errors/not-found-err');
const errorHandler = require('./middlewares/error-handler');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 4000, DB_URL = 'mongodb://127.0.0.1:27017/bitfilmsdb' } = process.env;

const app = express();

mongoose.connect(DB_URL, {
  useNewUrlParser: true,
});

app.use(cors({ origin: ['http://localhost:3000', 'http://projectkya.nomoredomainsrocks.ru/', 'https://projectkya.nomoredomainsrocks.ru/'], credentials: true }));
app.use(helmet());
app.use(express.json());

app.use(requestLogger);
app.use(limiter);
app.use(router);
app.use(errorLogger);
app.all('*', (req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});
app.use(errors());
app.use(errorHandler);
app.listen(PORT, () => { });
