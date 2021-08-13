const express = require('express');
const router = express.Router();
const {
  getBootcamps,
  createBootcamp,
  getSingleBootcamp,
  deleteBootcamp,
  updateBootcamp,
  getBootcampsInRadius,
  bootcampPhotoUpload,
} = require('../controllers/bootcampControllers');
const Bootcamp = require('../models/Bootcamp');
const advanceResults = require('../middleware/advanceResult');
//Include Other resource routers
const courseRouter = require('./courseRoutes');
const reviewRouter = require('./reviewRoutes');
const { protect, authorize } = require('../middleware/auth');

// :bootcampId/couses
router.use('/:bootcampId/courses', courseRouter);
router.use('/:bootcampId/reviews', reviewRouter);

router.route('/radius/:zipcode/:distance').get(getBootcampsInRadius);

router
  .route('/')
  .get(advanceResults(Bootcamp, ['courses', ' user']), getBootcamps)
  .post(protect, authorize('publisher', 'admin'), createBootcamp);
router.route('/:id/photo').put(protect, bootcampPhotoUpload);
router
  .route('/:id')
  .get(getSingleBootcamp)
  .put(protect, authorize('publisher', 'admin'), updateBootcamp)
  .delete(protect, authorize('publisher', 'admin'), deleteBootcamp);

module.exports = router;
