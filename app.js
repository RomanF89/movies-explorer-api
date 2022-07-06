require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const helmet = require('helmet');
const { errors } = require('celebrate');
const errorsHandler = require('./middlewares/errorsHandler');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const routes = require('./routes/routes');

mongoose.connect('mongodb://localhost:27017/bitfilmsdb');

const app = express();

const { PORT = 3000 } = process.env;

app.use(cors({
  credentials: true,
  origin:
  ['https://localhost:3001', 'https://localhost:3000',
    'https://mesto89.students.nomoredomains.xyz', 'https://api.mesto89.students.nomoredomains.xyz'],
}));

app.use(helmet());

app.use(express.json());

app.use(cookieParser());

app.listen(PORT, () => {
  console.log('server has been started');
});

app.use(requestLogger);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.use(routes);

app.use(errorLogger);

app.use(errors());

app.use(errorsHandler);
