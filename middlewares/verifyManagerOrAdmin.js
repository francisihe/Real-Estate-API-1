import jwt from 'jsonwebtoken';
import errorHandler from './errorHandler.js'
import { JWT_SECRET } from '../utils/variables.js';

export const verifyManagerOrAdmin = (req, res, next) => {
    let token = req.cookies.token;

    // Try to retrieve the token from the Authorization header if not found in cookies
    if (!token) {
        try {
            const authorizationHeader = req.headers.authorization;

            if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
                return next(errorHandler(401, 'Unauthorized. Please include a valid token.'));
            }

            token = authorizationHeader.split(' ')[1];

            jwt.verify(token, JWT_SECRET, (err, user) => {
                if (err) {
                    return next(errorHandler(403, 'Forbidden, managers or admins only. You do not have permission to proceed'));
                }

                if (user.role !== 'manager' && user.role !== 'admin') {
                    return next(errorHandler(403, 'Forbidden, managers or admins only. You do not have permission to proceed'));
                }

                req.user = user;
                next();
            });
        } catch (error) { 
            if (error.name === 'TokenExpiredError') {
                return next(errorHandler(401, 'Unauthorized. Token has expired.'));
              }
            if (error) throw error;
        }
    } else {
        // Token found in cookies
        jwt.verify(token, JWT_SECRET, (err, user) => {
            if (err) {
                return next(errorHandler(403, 'Forbidden, managers or admins only. You do not have permission to proceed'));
            }

            if (user.role !== 'manager' && user.role !== 'admin') {
                return next(errorHandler(403, 'Forbidden, managers or admins only. You do not have permission to proceed'));
            }

            req.user = user;
            next();
        });
    }
};



// jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
//     if (err) return next(errorHandler(403, 'Forbidden. You do not have permission to proceed'));

//     if (user.role !== 'manager' && user.role !== 'admin')
//         return next(errorHandler(403, 'Forbidden. You do not have permission to proceed'));

//     req.user = user;
//     next();
// });