const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cors = require('cors');
const colors = require('colors');
const fileUpload = require('express-fileupload');
const path = require('path');
const cookieParser = require('cookie-parser');
const mongoSanitizer = require('express-mongo-sanitize');
const helmet = require('helmet');
const xssClean = require('xss-clean');
const hpp = require('hpp');
const rateLimit = require('express-rate-limit');
// const logger = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');
const notFound = require('./middleware/notFound');
//Load ENV vars
dotenv.config({ path: './config/config.env' });

// DB file
const connectDb = require('./config/db_conn');

//Routes Files
const bootcampRoutes = require('./routes/bootcampRoutes');
const courseRoutes = require('./routes/courseRoutes');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const reviewRoutes = require('./routes/reviewRoutes');

const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());
//File Upload
app.use(fileUpload());
app.use(mongoSanitizer());
//Set security headers
app.use(helmet());
//Prevent XSS attack
app.use(xssClean());
//Rate Limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, //10 mins
  max: 100,
});
app.use(rateLimit());

//Prevent http param pollution
app.use(hpp());
//Set static folder
app.use(express.static(path.join(__dirname, `public`)));
//Logs requests
process.env.NODE_ENV === 'development' && app.use(morgan('dev'));

//Mount routers
app.use('/api/v1/bootcamps', bootcampRoutes);
app.use('/api/v1/courses', courseRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/auth/users', userRoutes);
app.use('/api/v1/reviews', reviewRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
connectDb().then(() => {
  app.listen(
    PORT,
    console.log(
      `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow
        .bold
    )
  );
});

process.on('unhandledRejection', (err, promise) => {
  console.log(`Erropr:-${err.message}`.red.underline);
  //close connection
  // app.close(() => process.exit(1));
});
