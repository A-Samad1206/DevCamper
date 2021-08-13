const jwt = require('jsonwebtoken');
const asyncHandler = require('./async');
const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/User');

exports.protect = asyncHandler(async (req, res, next) => {
  let header = req.headers.authorization,
    token;
  if (header && header.startsWith('Bearer ')) {
    token = header.split(' ')[1];
  }
  //If cookie is present at client-side
  else if (req.cookies.token) {
    token = req.cookies.token;
  }
  // console.log('req.cookies.token', req.cookies.token, 'req.cookies.token');

  //Make sure token exist
  if (!token) {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }
  try {
    //Verify token
    // console.log('token', token);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log('Decoded', decoded);
    const temp = await User.findById(decoded.id);
    req.user = temp;
    next();
  } catch (err) {
    console.log('From catch of protected');
    // console.error(err);
    return next(new ErrorResponse('Please Try again!.Server is busy.', 401));
  }
});

//Grant Access To Specific roles
exports.authorize =
  (...role) =>
  (req, res, next) => {
    if (!role.includes(req.user.role)) {
      let role = req.user.role;
      role = role.charAt(0).toUpperCase() + role.slice(1) + 's';
      return res.status(403).json({
        success: false,
        message: `${role} are not authorized to access this route`,
      });
    }
    next();
  };
