const ErrorResponse = require('../utils/errorResponse');
const notFound = (req, res, next) => {
  const err = {};
  err.message = 'Not Found';
  err.statusCode = 404;
  //   next(err);
  next(new ErrorResponse('Endpoint Not Found', 404));
};
module.exports = notFound;
