const router = require('express').Router();
const {
  ERR_SERVER_DOWN,
} = require('../utils/constants.js');

router.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error(ERR_SERVER_DOWN);
  }, 0);
});

module.exports = {
  router,
};
