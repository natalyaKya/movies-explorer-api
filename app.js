require('dotenv').config();
const express = require('express');
const cors = require('cors');
// eslint-disable-next-line import/no-extraneous-dependencies
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const { errors } = require('celebrate');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const errorHandler = require('./middlewares/error-handler');
const router = require('./routes/index');

mongoose.connect('mongodb://127.0.0.1:27017/bitfilmsdb');

const app = express();
app.use(cors({ origin: ['http://localhost:3003', 'https://projectkya.nomoredomainsrocks.ru', 'http://projectkya.nomoredomainsrocks.ru'], credentials: true }));
app.use(helmet());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(requestLogger);
app.use(router);
app.use(errorLogger);
app.use(errors());
app.use(errorHandler);
app.listen(3000);
