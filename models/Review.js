const mongoose = require('mongoose');
const ReviewSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, 'Please add a title for the review'],
    maxlength: 100,
  },
  text: {
    type: String,
    required: [true, 'Please add some text'],
  },
  rating: {
    type: Number,
    min: 1,
    max: 10,
    required: [true, 'Please add a rating between 1 and 10'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  bootcamp: {
    type: mongoose.Schema.ObjectId,
    ref: 'Bootcamp',
    required: true,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
});

//Prevent user from submitting more than one review per bootcamp
ReviewSchema.index({ bootcamp: 1, user: 1 }, { unique: true });

//Static method to get average of Rating
ReviewSchema.statics.getAverageRating = async function (bootcampId) {
  // console.log(`getAverageRating`.blue);
  const obj = await this.aggregate([
    {
      $match: { bootcamp: bootcampId },
    },
    {
      $group: {
        _id: '$bootcamp',
        averageRating: { $avg: '$rating' },
      },
    },
  ]);
  try {
    await this.model('Bootcamp').findByIdAndUpdate(bootcampId, {
      averageRating: obj[0].averageRating,
    });
  } catch (err) {
    console.log('Erroor FromFrom Static getAvergaerating');
    console.error(err);
  }
};
//Call getAverageRating after save
ReviewSchema.post('save', function (next) {
  console.log('Post##########################################');
  this.constructor.getAverageRating(this.bootcamp);
});
//Call getAverageRating before save
ReviewSchema.pre('remove', function (next) {
  console.log('##########################################');
  this.constructor.getAverageRating(this.bootcamp);
  next();
});
ReviewSchema.pre('update', function (next) {
  console.log('##########################################');
  this.constructor.getAverageRating(this.bootcamp);
  next();
});

module.exports = mongoose.model('Review', ReviewSchema);
