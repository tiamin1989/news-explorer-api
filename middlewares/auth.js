const jwt = require('jsonwebtoken');
const { devJWT } = require('../utils/dev-config');
const {
  MESSAGE_NEED_AUTHORIZATION,
} = require('../utils/constants.js');
const UnauthorizedError = require('../errors/unauthorized-err.js');

const handleAuthError = () => {
  throw new UnauthorizedError(MESSAGE_NEED_AUTHORIZATION);
};
const extractBearerToken = (header) => header.replace('Bearer ', '');

function auth(req, res, next) {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return handleAuthError();
  }
  const token = extractBearerToken(authorization);
  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET ? process.env.JWT_SECRET : devJWT);
  } catch (err) {
    return handleAuthError(res);
  }
  req.user = payload;
  return next();
}

module.exports = {
  auth,
};
