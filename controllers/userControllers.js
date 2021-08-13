const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');
const asyncHandler = require('../middleware/async');
//@desc   Get Users
//@route  GET {url}/auth/users
//@route  Private/Admin
exports.getUsers = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advanceResults);
});

//@desc   Get Single User
//@route  GET {url}/auth/users/:id
//@route  Private/Admin
exports.getSingleUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (user) {
    return res.status(200).json({ success: true, data: user });
  }
  res.status(400).json({ success: false });
});

//@desc   Create User
//@route  POST {url}/auth/users/
//@route  Private/Admin
exports.createUser = asyncHandler(async (req, res, next) => {
  const user = await User.create(req.body);
  if (user) {
    return res.status(200).json({ success: true, data: user });
  }
  res.status(400).json({ success: false });
});

//@desc   Update User
//@route  PUT {url}/auth/users/:id
//@route  Private/Admin
exports.updateUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (user) {
    return res.status(200).json({ success: true, data: user });
  }
  res.status(400).json({ success: false });
});

//@desc  Delete User
//@route  DELETE {url}/auth/users/:id
//@route  Private/Admin
exports.deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (user) {
    return res.status(200).json({ success: true, data: {} });
  }
  res.status(400).json({ success: false });
});
