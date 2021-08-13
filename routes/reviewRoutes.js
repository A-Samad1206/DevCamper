const express = require('express');
const {
  getReviews,
  getSingleReview,
  addReview,
  updateReview,
  deleteReview,
} = require('../controllers/reviewControllers');

const router = express.Router({ mergeParams: true });

const { protect, authorize } = require('../middleware/auth');
const advanceResults = require('../middleware/advanceResult');

const Review = require('../models/Review');
const populate = [
  {
    path: 'bootcamp',
    select: 'name description',
  },
  {
    path: 'user',
    select: 'email',
  },
];
router
  .route('/')
  .get(advanceResults(Review, populate), getReviews)
  .post(protect, authorize('user', 'admin'), addReview);
router
  .route('/:id')
  .get(getSingleReview)
  .put(protect, authorize('user', 'admin'), updateReview)
  .delete(protect, authorize('user', 'admin'), deleteReview);

module.exports = router;
