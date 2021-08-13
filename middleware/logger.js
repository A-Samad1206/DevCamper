// @desc log req to
const logger = (req, res, next) => {
  //  ${req.protocol}://${req.get('host')}
  console.log(`${req.method} ${req.originalUrl} `);
  next();
};
module.exports = logger;
