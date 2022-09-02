const Tour = require('../models/tourModel');

exports.getAllTours = async (req, res) => {
  try {
    const tours = await Tour.find();
    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: { tours },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: 'There was an issue fetching tour data', // Error handling TBD
    });
  }
};

exports.getTour = async (req, res) => {
  try {
    const { params } = req;
    const tour = await Tour.findById(params.id);
    res.status(200).json({
      status: 'success',
      data: { tour },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: 'There was an issue fetching tour data', // Error handling TBD
    });
  }
};

exports.createTour = async (req, res) => {
  const { body } = req;
  try {
    const newTour = await Tour.create(body);
    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const { body, params } = req;
    const tour = await Tour.findByIdAndUpdate(params.id, body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: 'Invalid data sent!', // Error handling TBD
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    const { params } = req;
    await Tour.findByIdAndDelete(params.id);
    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: 'Invalid data sent!', // Error handling TBD
    });
  }
};
