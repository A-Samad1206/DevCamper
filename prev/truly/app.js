const express = require('express');
const app = express();
const morgan = require('morgan');
const createError = require('http-errors');
// const mongoose = require('mongoose');
const chalk = require('chalk');
const { verifyAccessToken } = require('./helpers/accessToken');
require('dotenv').config();
const routes = require('./routers/auth.router');
// const postsRouters = require('./routers/postRouters.js');
app.use(morgan('dev'));
app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.get('/verify', verifyAccessToken, (req, res) => {
  res.send(req.payload);
});
app.use('/auth', routes);
// app.use('/posts', postsRouters);
app.use((req, res, next) => {
  next(createError.NotFound('This route does not exist'));
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    error: {
      status: err.status || 500,
      message: err.message,
    },
  });
});
const mongo = require('./helpers/mongo_Connection');
let PORT = process.env.PORT || 8888;
mongo
  .then((res) => {
    app.listen(PORT, () => {
      console.log(
        chalk.white.bgRed(
          '     Serevr is running on server ',
          PORT,
          'Mongo Connecton Established    '
        )
      );
    });
  })
  .catch((err) => console.log(err));
