import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import { generateVerificationCode } from '../utils/verification.js';
import { sendVerificationEmail } from '../utils/mailer/sendVerificationEmail.js';
import { newUserVerificationEmail } from '../utils/mailer/newUserVerificationEmail.js';
import { newUserGoogleSignUpEmail } from '../utils/mailer/newUserGoogleSignUpEmail.js';
import { forgotPasswordEmail } from '../utils/mailer/forgotPasswordEmail.js';
import { resetPasswordEmail } from '../utils/mailer/resetPasswordEmail.js';
import { JWT_SECRET } from '../utils/variables.js';

// Register New User Controller
export const createUser = async (req, res, next) => {
    try {
        const { firstname, lastname, email, password } = req.body;

        //Automatically generate Username from first and last names, add strings and numbers in lowercase
        const username = (firstname + lastname + Math.random().toString(36).substring(2, 5) + Math.floor(Math.random() * 100)).toLowerCase().replace(/\s/g, '');

        //Check username availability
        const alreadyExistingUsername = await User.findOne({ username });
        if (alreadyExistingUsername) { return res.status(400).json('Username has been taken. Please try another') };

        //Check for existing user
        const alreadyExistingUser = await User.findOne({ email });
        if (alreadyExistingUser) { return res.status(400).json('User with email already exists. Please login') };

        const hashedPassword = bcryptjs.hashSync(password, 10);

        // verification code and expiration time from utils/verification.js function
        const verificationResponse = await generateVerificationCode();
        const { verificationCode, expirationTime } = verificationResponse;

        const newUser = new User({ firstname, lastname, username, email, password: hashedPassword, isVerified: false, verificationCode: verificationCode, verificationExpiration: expirationTime });

        // Send verification email
        await newUserVerificationEmail(newUser.email, newUser.verificationCode, newUser.firstname);

        await newUser.save();
        res.status(201).json('User created successfully');
    } catch (error) {
        next(error);
    }
};

// Sign In Controller
export const signInUser = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        const validUser = await User.findOne({ email });
        if (!validUser) { return res.status(404).json('Invalid credentials. Please check your email and password or use Google signin') }
        const validPassword = bcryptjs.compareSync(password, validUser.password);
        if (!validPassword) { return res.status(404).json('Invalid credentials. Please check your email and password or use Google signin') }

        if (!validUser.isVerified) {
            // Generate new verification code and send it to the user's email
            const verificationResponse = await generateVerificationCode();
            validUser.verificationCode = verificationResponse.verificationCode;
            validUser.verificationExpiration = verificationResponse.expirationTime;
            await validUser.save();

            // Send verification email
            await sendVerificationEmail(validUser.email, validUser.verificationCode, validUser.firstname)

            // Return a response indicating that verification is required
            return res.status(401).json('Please verify your email to continue');
        }

        const token = jwt.sign({ id: validUser._id, role: validUser.role }, JWT_SECRET, { expiresIn: '6h' });
        const { password: pass, ...userDoc } = validUser._doc;

        res.status(200)
            .cookie('token', token)
            .json(userDoc);

    } catch (error) {
        next(error);
    }
};

// Verify User Controller
export const verifyUser = async (req, res, next) => {
    const { email, verificationCode } = req.body;

    try {
        const validUser = await User.findOne({ email });
        if (!validUser) { return res.status(404).json('User not found') }

        // Check if user is already verified
        if (validUser.isVerified) { return res.status(400).json('Your email is already verified. Proceed to login.') }

        if (validUser.verificationCode !== parseInt(verificationCode)) { return res.status(400).json('Invalid verification code') }
        if (validUser.verificationExpiration < new Date()) { return res.status(400).json('Verification code has expired') }

        validUser.isVerified = true;
        validUser.verificationCode = null; // Remove verification code from database
        validUser.verificationExpiration = null; // Remove verification expiration from database
        await validUser.save();

        // Send verification email if user is not verified
        if (!validUser.isVerified) {
            await sendVerificationEmail(validUser.email, validUser.verificationCode, validUser.firstname)
        }

        res.status(200).json('User verified successfully');
    } catch (error) {
        next(error);
    }
};

// Resend Verification Code Controller
export const resendVerificationCode = async (req, res, next) => {
    const { email } = req.body;

    try {
        const validUser = await User.findOne({ email });
        if (!validUser) { return res.status(404).json('User not found') }

        // Check if user is already verified
        if (validUser.isVerified) { return res.status(400).json('Your email is already verified. Proceed to login.') }

        // Generate new verification code and expiration time
        const verificationResponse = await generateVerificationCode();

        validUser.verificationCode = verificationResponse.verificationCode;
        validUser.verificationExpiration = verificationResponse.expirationTime;
        await validUser.save();

        // Send verification email
        await sendVerificationEmail(validUser.email, validUser.verificationCode, validUser.firstname)

        res.status(200).json('Verification code resent successfully');
    } catch (error) {
        next(error);
    }
};

// Implement SignUp and SignIn via Google
export const google = async (req, res, next) => {
    try {
        // Check if user exists 
        const validUser = await User.findOne({ email: req.body.email });

        // If User exists, issue token and sign in
        if (validUser) {

            // If a user is unverified but logs in with their Google account, verify them
            if (!validUser.isVerified) {
                validUser.isVerified = true;
                await validUser.save();
            }

            const token = jwt.sign({ id: validUser._id, role: validUser.role }, JWT_SECRET, { expiresIn: '6h' });
            const { password: pass, ...userDoc } = validUser._doc;
            res.status(200)
                .cookie('token', token)
                .json(userDoc);
        } else {
            // Generate random password and hash it
            const password = Math.random().toString(36).substring(2, 12);
            const hashedPassword = bcryptjs.hashSync(password, 10);

            // If User does not exist, create new user and issue token  
            const newUser = new User({
                username: req.body.name.split(' ').join('').toLowerCase() +
                    Math.random().toString(36).substring(2, 5) + Math.floor(Math.random() * 100),
                firstname: req.body.name.split(' ')[0],
                lastname: req.body.name.split(' ')[1],
                email: req.body.email,
                password: hashedPassword,
                avatar: req.body.photo,
                role: 'user',
                isVerified: true,
            });

            await newUser.save();
            const token = jwt.sign({ id: newUser._id, role: newUser.role }, JWT_SECRET, { expiresIn: '6h' });
            const { password: pass, ...userDoc } = newUser._doc;

            // Send welcome email
            await newUserGoogleSignUpEmail(newUser.email, newUser.firstname);

            res.status(200)
                .cookie('token', token)
                .json(userDoc);
        }
    } catch (error) {
        next(error)
    }
};

// Forgot Password Controller
export const forgotPassword = async (req, res, next) => {
    const { email } = req.body;

    try {
        const validUser = await User.findOne({ email });
        if (!validUser) { return res.status(404).json('If your account exists, a password reset mail will be sent. Please check your email for password reset instructions') }

        // Generate new verification code and expiration time
        const verificationResponse = await generateVerificationCode();
        validUser.verificationCode = verificationResponse.verificationCode;
        validUser.verificationExpiration = verificationResponse.expirationTime;
        await validUser.save();

        // Send forgot password email and verification code
        await forgotPasswordEmail(validUser.email, validUser.verificationCode, validUser.firstname);

        res.status(200).json('If your account exists, a password reset mail will be sent. Please check your email for password reset instructions');

    } catch (error) {
        next(error);
    }
}

// Reset Password Controller
export const resetPassword = async (req, res, next) => {
    const { email, verificationCode, newPassword } = req.body;

    try {
        const validUser = await User.findOne({ email });
        if (!validUser) { return res.status(404).json('User not found') }

        if (validUser.verificationCode !== parseInt(verificationCode)) { return res.status(400).json('Invalid verification code') }
        if (validUser.verificationExpiration < new Date()) { return res.status(400).json('Verification code has expired') }

        const hashedPassword = bcryptjs.hashSync(newPassword, 10);
        validUser.password = hashedPassword;

        // Remove verification code and expiration time from database
        validUser.verificationCode = null;
        validUser.verificationExpiration = null;
        await validUser.save();

        // Send password reset confirmation email
        await resetPasswordEmail(validUser.email, validUser.firstname);

        res.status(200).json('Password reset successfully');

    } catch (error) {
        next(error);
    }
}

// Sign Out User Controller
export const signout = async (req, res, next) => {
    try {
        res.clearCookie('token')
            .status(200)
            .json('User has been logged out successfully');
    } catch (error) {
        next(error);
    }
};