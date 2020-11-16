const mongoose = require('mongoose');
const chrisoValidator = require('validator');
const {
  MESSAGE_WRONG_ARTICLE_SOURCE_URL,
  MESSAGE_WRONG_INTERNAL_ARTICLE_URL,
  MESSAGE_WRONG_IMAGE_URL,
} = require('../utils/constants.js');

const articleSchema = new mongoose.Schema({
  keyword: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  title: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 70,
  },
  text: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  source: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        return chrisoValidator.isURL(v);
      },
      message: MESSAGE_WRONG_INTERNAL_ARTICLE_URL,
    },
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        return chrisoValidator.isURL(v);
      },
      message: MESSAGE_WRONG_IMAGE_URL,
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
});

module.exports = mongoose.model('article', articleSchema);
