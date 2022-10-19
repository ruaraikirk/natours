const express = require('express');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const helmet = require('helmet');
const hpp = require('hpp');
const morgan = require('morgan');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
require('dotenv').config();

// Set up express
const app = express();
// Apply middlewares
// HTTP Security Headers
app.use(helmet());
// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
// Rate limiting
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, plese try again later',
});
app.use('/api', limiter);
// Body parser
app.use(
  express.json({
    limit: '10kb',
  })
);
// Sanitize data against NoSQL query injection
app.use(mongoSanitize());
// Sanitize data against XSS
app.use(xss());
// Prevent parameter polution
app.use(
  hpp({
    whiteList: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'difficulty',
      'price',
      'maxGroupSize',
    ],
  })
);
// Serving static files
app.use(express.static(`${__dirname}/public`));
// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});
// Apply routers
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
// Unresolved  Route Handling
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});
// Error Handling Middleware
app.use(globalErrorHandler);
// Export
module.exports = app;
