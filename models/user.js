const mongoose = require('mongoose');
const chrisoValidator = require('validator');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        return chrisoValidator.isEmail(v);
      },
      message: 'Неправильный email',
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
    default: 'Укажите имя',
  },
});

module.exports = mongoose.model('user', userSchema);
