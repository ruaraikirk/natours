const R = require('ramda');
const AppError = require('../utils/appError');

const handleCastErrorDb = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDb = (err) => {
  const duplicateValue = err.errmsg.match(/(["'])(?:(?=(\\?))\2.)*?\1/);
  const message = `Duplicate field value: ${duplicateValue[0]}! Please use another value.`;
  return new AppError(message, 400);
};

const handleValidationErrorDb = (err) => {
  const validationErrors = Object.values(err.errors).map(
    (item) => item.message
  );
  const message = `Invalid input data! ${validationErrors.join('. ')}`;
  return new AppError(message, 400);
};

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    stack: err.stack,
    error: err,
  });
};

const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    // Operational (Trusted) Error
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    // Programming or other unknown error: don't leak error details
    console.error('NATOURS ERROR: ', err); // 1. Log
    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong',
    }); // 2. Send generic response
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let errorProd = R.clone(err);
    if (errorProd.name === 'CastError')
      errorProd = handleCastErrorDb(errorProd);
    if (errorProd.code === 11000)
      errorProd = handleDuplicateFieldsDb(errorProd);
    if (errorProd.name === 'ValidationError')
      errorProd = handleValidationErrorDb(errorProd);
    sendErrorProd(errorProd, res);
  }
};
