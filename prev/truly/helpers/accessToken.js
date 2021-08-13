const chalk = require('chalk');
const error = chalk.bold.red.bgWhite;
const log = console.log;
const warning = chalk.keyword('orange');
const jwt = require('jsonwebtoken');
const createError = require('http-errors');
const redisClient = require('./init_redis');
// const redisClient = {};
require('dotenv').config();
module.exports = {
  signAccessToken: (userID) => {
    userID = String(userID);
    return new Promise((resolve, reject) => {
      const payload = {};
      const secret = 'process.env.ACCESS_TOKEN_SECRET';
      const options = {
        expiresIn: '1h',
        issuer: 'imsamad.com',
        audience: userID,
      };
      jwt.sign(payload, secret, options, (err, token) => {
        if (err) {
          console.log(err);
          reject(createError(500, 'From Access Token Internal server error'));
          /* This errror is being thrown after the user has been 
                   saved in the DBMS 
                */
        }
        resolve(token);
      });
    });
  },

  verifyAccessToken: (req, res, next) => {
    if (!req.headers['x-auth-token']) {
      return next(createError.Unauthorized());
    }
    const token = req.headers['x-auth-token'].split(' ')[1];
    // log(error("Verify", token))
    jwt.verify(token, 'process.env.ACCESS_TOKEN_SECRET', (err, payload) => {
      if (err) {
        const msg = 'JsonWebTokenError' ? 'Unauthorized' : err.message;
        return next(createError.Unauthorized(msg));
      }
      req.payload = payload;
      next();
    });
  },

  signRefreshToken: (userID) => {
    userID = String(userID);
    return new Promise((resolve, reject) => {
      const payload = {};
      const secret = 'process.env.REFRESH_TOKEN_SECRET';
      const options = {
        expiresIn: '1y',
        issuer: 'imsamad.com',
        audience: userID,
      };
      jwt.sign(payload, secret, options, (err, token) => {
        if (err) {
          reject(createError(500, 'From Access Token Internal server error'));
          /* This errror is being thrown after the user has been 
                   saved in the DBMS 
                */
        }
        redisClient.SET(
          userID,
          token,
          'EX',
          365 * 24 * 60 * 60,
          (err, reply) => {
            if (err) {
              log(error(err));
              reject(createError.InternalServerError());
              return;
            }
            resolve(token);
          }
        );
        resolve(token);
      });
    });
  },

  verifyRefreshToken: (token) => {
    return new Promise((resolve, reject) => {
      if (!token) {
        return next(createError.Unauthorized());
      }
      jwt.verify(token, 'process.env.REFRESH_TOKEN_SECRET', (err, payload) => {
        if (err) {
          const msg = 'JsonWebTokenError' ? 'Unauthorized' : err.message;
          return reject(createError.Unauthorized(msg));
        }
        const uID = payload.aud;
        console, log('uid', uID);
        redisClient.GET(uID, (err, reply) => {
          if (err) {
            console.log(err.messsage);
            reject(createError.InternalServerError());
          }
          if (token === reply) {
            return resolve(uID);
          } else {
            reject(createError.Unauthorized());
          }
        });
        resolve(uID);
      });
    });
  },
};
