const router = require('express').Router();
const createError = require('http-errors');
const chalk = require('chalk');
const yel = chalk.blue.bgYellow;
const user = require('../Models/users.model');
const { authSchema } = require('../helpers/validation_schema');
const {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} = require('../helpers/accessToken');
const redisClient = require('../helpers/init_redis');
// const redisClient = {};
router.post('/register', async (req, res, next) => {
  try {
    /* Second Layer of validation b4 interacting w/ actual DBMS */
    const result = await authSchema.validateAsync(req.body);
    let existingUser = await user.findOne({ email: result.email });
    if (existingUser) {
      throw createError(422, 'An account with this email already exists.');
    }
    const users = new user(result);
    /*  End 2 layer validation  */
    const savedUser = await users.save();
    const token = await signAccessToken(savedUser._id);
    const refToken = await signRefreshToken(savedUser._id);
    res.send({ token: token, refreshToken: refToken });
  } catch (err) {
    if (err.isJoi) err.status = 422;
    next(err);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const result = await authSchema.validateAsync(req.body);
    let existingUser = await user.findOne({ email: result.email });
    if (!existingUser) {
      throw createError(404, 'This email is not registered.');
    }
    const isMatch = await existingUser.isValidPassword(result.password);
    if (!isMatch) {
      throw createError.Unauthorized('Invalid username/password.');
    }
    const token = await signAccessToken(existingUser._id);
    const refToken = await signRefreshToken(existingUser._id);
    res.send({ token: token, refreshToken: refToken });
  } catch (err) {
    /* Both work same */
    if (err.isJoi === true)
      err = createError.BadRequest('Invalid username/password.');
    // return next(createError.BadRequest("Invalid username/password"))
    next(err);
  }
});

router.post('/refresh-token', async (req, res, next) => {
  try {
    const { refToken } = req.body;
    if (!refToken) throw createError.BadRequest();
    console.log(yel(refToken));
    const getId = await verifyRefreshToken(refToken);
    const freshAccessToken = await signAccessToken(getId);
    res.send({ freshAccessToken });
  } catch (err) {
    next(err);
  }
});

router.delete('/logout', async (req, res, next) => {
  try {
    const { delUser } = req.body;
    if (!delUser) throw createError.BadRequest();
    const id = await verifyRefreshToken(delUser);
    redisClient.DEL(id, (err, reply) => {
      if (err) {
        console.log(err.message);
        throw createError.InternalServerError();
      }
      console.log(reply);
      res.sendStatus(204);
    });
  } catch (err) {
    next(err);
  }
});

router.get('/all', async (req, res) => {
  const all = await user.find({});
  res.send(all);
});

module.exports = router;
