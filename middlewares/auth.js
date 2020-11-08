const jwt = require('jsonwebtoken');
require('dotenv').config();
/* const { JWT_SECRET = 'jwt-secret' } = process.env; */

const handleAuthError = (res) => {
  res.status(401).send({ message: 'Необходима авторизация' });
};
const extractBearerToken = (header) => header.replace('Bearer ', '');

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return handleAuthError(res);
  }
  const token = extractBearerToken(authorization);
  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return handleAuthError(res);
  }
  req.user = payload;
  next();
};
