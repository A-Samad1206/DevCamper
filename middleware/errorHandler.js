const ErrorResponse = require('../utils/errorResponse');
const letgo = (err) => {
  console.log('========================================================');
  console.log('==================Fields in err are=====================');
  console.log('========================================================');
  console.log('                 ');
  for (x in err) {
    console.log('>>', x, '==>');
  }
  console.log('                 ');
  console.log('|||||||||||||||||||||||||||||||||||||||||||||||||||||||||');
  console.log('|||||||||||||||||||||||||||||||||||||||||||||||||||||||||');
  console.log('|||||||||||||||||||||||||||||||||||||||||||||||||||||||||');
  console.log('                 ');
  console.log(err);
  console.log('                 ');
  console.log('----------------------------------------------------------');
  console.log('------------------The End---------------------------------');
  console.log('----------------------------------------------------------');
};

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
  //Mongo Object ID error
  process.env.NODE_ENV === 'development' && letgo(err);
  if (err.name === 'CastError') {
    console.log('**************CastError******************');
    const message = `Resource not found with id of ${err.value}`;
    error = new ErrorResponse(message, 404);
  }

  if (err.name === 'ValidationError') {
    console.log('**************ValidationError******************');
    const message = Object.values(err.errors).map((val) => val.message);
    // const message = `All Fields are required`;
    error = new ErrorResponse(message, 404);
  }

  // Mongoose duplicate key
  if (err.name === 'MongoError') {
    console.log('**************MongoError******************');
    let message;
    if (err.codeName === 'BadValue') {
      message = `Input Correct Parameters.`;
    } else {
      message = `Duplicate field value entered`;
    }
    error = new ErrorResponse(message, 404);
  }
  /*
  if ((err.name = 'TypeError')) {
    console.log('**************TypeError******************');
    error = new ErrorResponse('Sorry, Server Error', 404);
    // log this error to Admin Dashboard
  }*/
  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error',
  });
};
module.exports = errorHandler;
