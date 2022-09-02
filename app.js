const express = require('express');
const morgan = require('morgan');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
require('dotenv').config();

// Set up express
const app = express();
// Apply middlewares
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(express.json());

app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});
// Apply routers
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
// Export
module.exports = app;
