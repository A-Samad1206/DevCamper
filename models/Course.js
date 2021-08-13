const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: [true, 'Please add a course title'],
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
    },
    weeks: {
      type: String,
      required: [true, 'Please add number of weeks'],
    },
    tuition: {
      type: Number,
      required: [true, 'Please add a tuition cost!'],
    },
    minimumSkill: {
      type: String,
      required: [true, 'Please add a minimum skill'],
      enum: ['beginner', 'intermediate', 'advanced'],
    },
    scholarshipAvailable: {
      type: Boolean,
      default: false,
    },
    bootcamp: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Bootcamp',
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

//Static method to get average of course tutions
CourseSchema.statics.getAverageCost = async function (bootcampId) {
  // console.log(`getAverageCost`.blue);
  const obj = await this.aggregate([
    {
      $match: { bootcamp: bootcampId },
    },
    {
      $group: {
        _id: '$bootcamp',
        averageCost: { $avg: '$tuition' },
      },
    },
  ]);
  try {
    await this.model('Bootcamp').findByIdAndUpdate(bootcampId, {
      averageCost: (Math.ceil(obj[0].averageCost) / 10) * 10,
    });
  } catch (err) {
    console.log('Erroor FromFrom Static getAvergaeCost');
    console.error(err);
  }
  // console.log('obj', obj, 'obj');
};
//Get Average cost after save
CourseSchema.post('save', function (next) {
  this.constructor.getAverageCost(this.bootcamp);
});
//Get Average cost after save
CourseSchema.pre('remove', function (next) {
  this.constructor.getAverageCost(this.bootcamp);
  next();
});

module.exports = mongoose.model('Course', CourseSchema);
