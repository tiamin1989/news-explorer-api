const jwt = require('jsonwebtoken');
const { devJWT } = require('../utils/dev-config');
const {
  MESSAGE_NEED_AUTHORIZATION,
} = require('../utils/constants.js');

const handleAuthError = (res) => {
  res.status(401).send({ message: MESSAGE_NEED_AUTHORIZATION });
};
const extractBearerToken = (header) => header.replace('Bearer ', '');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return handleAuthError(res);
  }
  const token = extractBearerToken(authorization);
  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET ? process.env.JWT_SECRET : devJWT);
  } catch (err) {
    return handleAuthError(res);
  }
  req.user = payload;
  next();
};
