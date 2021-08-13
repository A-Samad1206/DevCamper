const express = require('express');

const {
  getUsers,
  getSingleUser,
  createUser,
  updateUser,
  deleteUser,
} = require('../controllers/userControllers');

const User = require('../models/User');

const advanceResults = require('../middleware/advanceResult');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router({ mergeParams: true });

router.use(protect);
router.use(authorize('admin'));

router.route('/').get(advanceResults(User), getUsers).post(createUser);

router.route('/:id').get(getSingleUser).put(updateUser).delete(deleteUser);

module.exports = router;
