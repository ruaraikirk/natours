const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'User must have a name'],
  },
  email: {
    type: String,
    unique: true,
    required: [true, 'User must have an email'],
    // index: { unique: true },
    validate: [validator.isEmail, 'Input is not a valid email address'],
    lowercase: true,
  },
  photo: String,
  role: {
    type: String,
    enum: ['admin', 'user', 'guide', 'lead-guide'],
    default: 'user',
  },
  password: {
    type: String,
    required: [true, 'User must have a password'],
    minLength: 8,
    select: false, // will not show up on client
  },
  passwordConfirm: {
    type: String,
    required: [true, 'User must confirm password'],
    validate: {
      // This only works on CREATE and  SAVE!!!
      validator: function (el) {
        return el === this.password;
      },
      message: 'Passwords are not the same',
    },
  },
  passwordChangedAt: Date,
  passwordResetToken: {
    type: String,
    select: false, // will not show up on client
  },
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

userSchema.pre('save', async function (next) {
  // Only run this function if password was modified
  if (!this.isModified('password')) return next();
  // Hash the password with a cost of 12
  this.password = await bcrypt.hash(this.password, 12);
  // Delete password confirm
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre('save', async function (next) {
  // Only run this function if password was modified and document is not new
  if (!this.isModified('password') || this.isNew) return next();
  // Update passwordChangedAt property
  this.passwordChangedAt = Date.now() - 1000; // Ensures token is not marked as expired, better way?
  next();
});

userSchema.pre(/^find/, async function (next) {
  this.find({ active: { $ne: false } });
  next();
});

// Instance Methods - available on all documents in collection
userSchema.methods.passwordCheck = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.isPasswordUpdated = function (jwtTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return jwtTimestamp < changedTimestamp;
  }
  // False = not changed
  return false;
};

userSchema.methods.generatePasswordResetToken = async function () {
  const resetToken = await crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = await crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
