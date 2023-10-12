require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const routerUser = require('./routes/users');
const routerMovie = require('./routes/movies');
const auth = require('./middlewares/auth');
const NotFoundError = require('./errors/not-found-err');
const errorHandler = require('./middlewares/error-handler');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const {
  login,
  createUser,
  logout,
} = require('./controllers/users');
const { validationLogin, validationCreateUser } = require('./middlewares/validation');

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
app.use(
  rateLimit({
    windowMs: 40 * 60 * 1000,
    max: 70,
    message: 'Too many requests',
  }),
);

// app.get('/crash-test', () => {
//   setTimeout(() => {
//     throw new Error('Сервер сейчас упадёт');
//   }, 0);
// });
app.post('/signin', validationLogin, login);
app.post('/signup', validationCreateUser, createUser);
app.get('/signout', logout);
app.use(cookieParser());
app.use(auth);
app.use('/users', routerUser);
app.use('/movies', routerMovie);
app.use(errorLogger);
app.all('*', (req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});
app.use(errors());
app.use(errorHandler);
app.listen(PORT, () => { });
