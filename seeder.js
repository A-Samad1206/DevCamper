const fs = require('fs');
const colors = require('colors');
const dotenv = require('dotenv');
dotenv.config({ path: './config/config.env' });

//Load Models
const Bootcamp = require('./models/Bootcamp');
const Course = require('./models/Course');
const User = require('./models/User');
const Review = require('./models/Review');
const connectDb = require('./config/db_conn');
const bootcamps = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/bootcamps.json`, `utf-8`)
);
const courses = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/courses.json`, `utf-8`)
);
const users = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/users.json`, `utf-8`)
);
const reviews = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/reviews.json`, `utf-8`)
);
//Import into DB
const importData = async () => {
  try {
    await Bootcamp.create(bootcamps);
    await Course.create(courses);
    await User.create(users);
    await Review.create(reviews);
    console.log('Data imported'.green.inverse);
    process.exit(0);
  } catch (err) {
    console.log('Error', err);
  }
};
const deleteData = async () => {
  try {
    await Bootcamp.deleteMany();
    await Course.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();
    console.log('Data deleted'.red.inverse);
    process.exit(0);
  } catch (err) {
    console.log('Error', err);
  }
};
// console.log('process', process.argv);
connectDb().then(() => {
  if (process.argv[2] === '-i') {
    importData();
  } else if (process.argv[2] === '-d') {
    deleteData();
  }
});
