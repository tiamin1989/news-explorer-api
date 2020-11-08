const mongoose = require('mongoose');

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
    minlength: 250,
    maxlength: 2500,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  source: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        return chrisoValidator.isURL(v);
      },
      message: 'Неправильная ссылка на источник статьи'
    },
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        return /[\d\wа-яёА-ЯЁ]+([\d\wа-яёА-ЯЁ\-]+)*/.test(v);
      },
      message: 'Неправильная внутренняя ссылка для статьи'
    },
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        return chrisoValidator.isURL(v);
      },
      message: 'Неправильная ссылка для картинки'
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
});

module.exports = mongoose.model('article', articleSchema);
