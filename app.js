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

const { PORT = 3001 } = process.env;

const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/bitfilmsdb', {
  useNewUrlParser: true,
});
// поменять домены
app.use(cors({ origin: ['http://localhost:3000', 'https://mesto.natalyakya.nomoredomainsrocks.ru', 'http://mesto.natalyakya.nomoredomainsrocks.ru'], credentials: true }));
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
