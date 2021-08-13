const express = require('express');
const router = express.Router({ mergeParams: true });
const {
  getCourses,
  createCourse,
  getSingleCourse,
  deleteCourse,
  updateCourse,
} = require('../controllers/courseControllers');
const Course = require('../models/Course');
const advanceResults = require('../middleware/advanceResult');
const { protect, authorize } = require('../middleware/auth');

router
  .route('/:id')
  .get(getSingleCourse)
  .put(protect, authorize('publisher', 'admin'), updateCourse)
  .delete(protect, authorize('publisher', 'admin'), deleteCourse);
router
  .route('/')
  .get(advanceResults(Course, ['bootcamp', 'user']), getCourses)
  .post(protect, authorize('publisher', 'admin'), createCourse);

module.exports = router;
