import express from 'express';
import {
    createUser, google, signInUser, signout, verifyUser,
    resendVerificationCode, forgotPassword, resetPassword
} from '../controllers/authController.js';

const router = express.Router();

// Routes and Controllers
router.route('/signup')
    .post(createUser);

router.route('/signin')
    .post(signInUser);

router.route('/verify')
    .post(verifyUser);

router.route('/resend-verification-code')
    .post(resendVerificationCode);

router.route('/google')
    .post(google);

router.route('/forgot-password')
    .post(forgotPassword);

router.route('/reset-password')
    .post(resetPassword);

router.route('/signout')
    .get(signout)

export default router;