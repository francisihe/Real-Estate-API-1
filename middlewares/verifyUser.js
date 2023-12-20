import jwt from 'jsonwebtoken';
import errorHandler from './errorHandler.js'
import { JWT_SECRET } from '../utils/variables.js';

export const verifyUser = (req, res, next) => {
  let token = req.cookies.token;

  // Try to retrieve the token from the Authorization header if not found in cookies
  if (!token) {
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
      return next(errorHandler(401, 'Unauthorized. Please include a valid token.'));
    }

    token = authorizationHeader.split(' ')[1];
  }

  if (!token) {
    return next(errorHandler(401, 'Unauthorized. Please login to continue'));
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return next(errorHandler(401, 'Unauthorized. Token has expired.'));
      }
      return next(errorHandler(403, 'Forbidden. You do not have permission to view this page'));
    }

    req.user = user;
    next();
  });
};
