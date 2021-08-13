const Course = require('../models/Course');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Bootcamp = require('../models/Bootcamp');
const Review = require('../models/Review');

//@desc   Get reviews
//@route  GET {url}/reviews
//@route  GET {url}/bootcamps/:bootcampId/reviews
//@route  Public
exports.getReviews = asyncHandler(async (req, res, next) => {
  if (req.params.bootcampId) {
    const reviews = await Review.find({
      bootcamp: req.params.bootcampId,
    }).populate('user');
    return res
      .status(200)
      .json({ success: true, count: reviews.length, data: reviews });
  } else {
    res.status(200).json(res.advanceResults);
  }
});

//@desc   Get reviews
//@route  GET {url}/reviews/:id
//@route  Public
exports.getSingleReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id).populate('bootcamp user');
  if (review) {
    return res
      .status(200)
      .json({ success: true, count: review.length, data: review });
  } else {
    res.status(404).json({ success: false, error: 'No review ' });
  }
});

//@desc   Add review
//@route  GET {url}/bootcamps/:bootcampId/reviews
//@route  Private
exports.addReview = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.bootcampId);
  if (!bootcamp) {
    return res
      .status(404)
      .json({ success: false, error: 'Bootcamp Not Found.' });
  }
  const alreadyReviewd = await Review.find({
    bootcamp: req.params.bootcampId,
    user: req.user.id,
  });
  if (alreadyReviewd.length) {
    return res
      .status(404)
      .json({ success: false, error: 'Sorry already reviewed .Thankyou!' });
  }
  req.body.bootcamp = bootcamp.id;
  req.body.user = req.user.id;
  const review = await Review.create(req.body);
  if (!review) {
    return res.status(404).json({ success: false, error: 'Process failed' });
  }
  res.status(200).json({ success: true, data: review });
});

//@desc   Update review
//@route  PUT {url}/reviews/:id
//@route  Private
exports.updateReview = asyncHandler(async (req, res, next) => {
  //Rating nt working fine
  let review = await Review.findById(req.params.id);
  if (!review) {
    return res.status(404).json({ success: false, error: 'Process failed' });
  }
  if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return res
      .status(404)
      .json({ success: false, error: 'Unauthorise request.' });
  }
  review = await Review.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, data: review });
});

//@desc   Delete review
//@route  DELETE {url}/reviews/:id
//@route  Private
exports.deleteReview = asyncHandler(async (req, res, next) => {
  //Rating nt working fine
  let review = await Review.findById(req.params.id);
  if (!review) {
    return res.status(404).json({ success: false, error: 'Process failed' });
  }
  if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return res
      .status(404)
      .json({ success: false, error: 'Unauthorise request.' });
  }
  await Review.remove();

  res.status(200).json({ success: true, data: {} });
});
