const mongoose = require('mongoose');
const slugify = require('slugify');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Tour must have a name'],
      unique: true,
      trim: true,
      maxLength: [40, 'A tour name must be greate than 40 characters'],
      minLength: [
        10,
        'A tour name must be greater than or equal to 10 characters',
      ],
      // validate: [validator.isAlpha, 'Name must only contain letters'],
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'Tour must have a duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'Tour must have a group size'],
    },
    difficulty: {
      type: String,
      required: [true, 'Tour must have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficult must be either easy, medium or difficult',
      },
    },
    rating: {
      type: Number,
      default: 4.5,
    },
    ratingAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be greater than or equal to 1.0'],
      max: [5, 'Rating must be less than or equal to 5.0'],
    },
    ratingQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'Tour must have a price'],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          // Value of this only going to point to document when creating new document
          return val < this.price;
        },
        message: 'Discount price ({VALUE)} should be less than regular price',
      },
    },
    summary: {
      type: String,
      required: [true, 'Tour must have a summary'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'Tour must have a cover image'],
    },
    images: [String],
    secretTour: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false, // Do not sent back in client response
    },
    startDates: [Date],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

tourSchema.virtual('durationWeeks').get(function () {
  // function used as arrow function no access to this
  return this.duration / 7;
});

// Document middleware which will run before .save() and .create() (but not .insertMany())
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// tourSchema.post('save', function (doc, next) {
//   // Stuff
//   next();
// });

// Query  middleware
tourSchema.pre(/^find /, function (next) {
  this.find({ secretTour: { $ne: true } });
  next();
});

// Aggregatio middleware
tourSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({
    $match: { secretTour: { $ne: true } },
  });
  next();
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
