const mongoose = require('mongoose');
const chrisoValidator = require('validator');
const {
  MESSAGE_WRONG_EMAIL,
} = require('../utils/constants.js');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        return chrisoValidator.isEmail(v);
      },
      message: MESSAGE_WRONG_EMAIL,
    },
    unique: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
});

module.exports = mongoose.model('user', userSchema);
