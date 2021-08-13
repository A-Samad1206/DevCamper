const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');
const asyncHandler = require('../middleware/async');
const crypto = require('crypto');

//@desc   Register User
//@route  POST {url}/auth/register
//@route  Public
exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  // Create User
  const user = await User.create({ name, email, password, role });
  if (user) {
    return sendTokenResponse(user, 200, res);
  }
  res.status(400).json({ success: false });
});

//@desc   Login User
//@route  POST {url}/auth/login
//@route  Public
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  //Validate email ,username
  if (!email || !password) {
    return res
      .status(404)
      .json({ success: false, error: 'Provide all credentials.' });
  }

  //Check if email matches or exist
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    return res.status(404).json({ success: false, error: 'Incorrect email.' });
  }

  //check if paasword matches
  const isMatch = await user.matchPassword(password);
  if (isMatch) {
    return sendTokenResponse(user, 200, res);
  }
  res.status(404).json({ success: false, error: 'Incorrect Password.' });
});

//@desc   Get current logged in user
//@route  POST {url}/auth/me
//@route  Private
exports.getMe = asyncHandler(async (req, res, next) => {
  if (req.user.id) {
    const user = await User.findById(req.user.id);
    return res.status(200).json({ success: true, data: user });
  }
  res.status(400).json({ success: false, error: 'Login First' });
});

//@desc   Forgot Password
//@route  POST {url}/auth/forgotpassword
//@route  Public
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res
      .status(404)
      .json({ success: false, error: `No user exist with ${req.body.email}` });
  }
  //Get reset token
  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });
  const resetUrl = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/auth/resetPassword/${resetToken}`;
  // console.log(resetUrl);
  const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n<a href=${resetUrl}> <h2>Link</h2></a>`;
  try {
    await sendEmail({
      email: user.email,
      subject: 'Password Token',
      message,
      resetUrl,
    });
    res.status(200).json({
      success: true,
      data: 'Email sent',
    });
  } catch (err) {
    console.log('Error From Reset Forget Password');
    console.log(err);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    res.status(500).json({
      success: false,
      error: 'Unable to Process request please, try again',
    });
  }
  console.log('resetToken', resetToken, 'resetToken');
});

//@desc   Reset Password
//@route  PUT {url}/auth/resetPassword/:resetToken
//@route  Public
exports.resetPassword = asyncHandler(async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.resetToken)
    .digest('hex');
  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });
  if (!user) {
    return res.status(400).json({ error: 'Invalid token' });
  }
  //Set the new Password
  user.password = req.body.password; //Can apply condition here.
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();
  if (!user) {
    return res
      .status(404)
      .json({ status: false, error: 'Unable to reset password ,try again!' });
  }
  sendTokenResponse(user, 200, res);
});

//@desc   Update user details
//@route  PUT {url}/auth/updatedetails
//@route  Private
exports.updateDetails = asyncHandler(async (req, res, next) => {
  const fieldsToUpdate = {
    name: req.body.name,
    email: req.body.email,
  };
  if (!req.body.name && req.body.email) {
    return res.status(404).json({ success: false, error: 'Provide data.' });
  }
  // if (req.user.id) {
  const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
    new: true,
    runValidators: true,
  });
  if (user) {
    return res.status(200).json({ success: true, data: user });
  }
  res.status(400).json({ success: false, error: 'Unable To Update Details' });
});

//@desc   Update password
//@route  PUT {url}/auth/updatepassword
//@route  Private
exports.updatePassword = asyncHandler(async (req, res, next) => {
  let user = await User.findById(req.user.id).select('password');

  console.log('user', user, 'user');
  const isMatch = await user.matchPassword(req.body.currentPassword);
  if (isMatch) {
    user.password = req.body.newPassword;
    await user.save();
    sendTokenResponse(user, 200, res);
  }
  res.status(200).json({ success: true, error: 'Incorrect password' });
});

//@desc   Log out user/clear cookie
//@route  GET {url}/auth/logout
//@route  Private
exports.logout = asyncHandler(async (req, res, next) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ success: true });
});

//Get token from model ,create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  // Create Token
  const token = user.getSignedJwtToken();
  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production' ? true : false,
  };
  return res
    .status(statusCode)
    .cookie('token', token, options)
    .json({ success: true, token });
};
