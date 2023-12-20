import { transporter } from './transporter.js';
import { EMAIL } from '../variables.js';

export const newUserVerificationEmail = async (email, verificationCode, firstname) => {
    const mailOptions = {
        from: `Unilodge Realty <${EMAIL}>`,
        to: email,
        bcc: 'unilodgeng103@gmail.com',
        subject: 'Welcome to Unilodge Realty - Verify Your Email',
        html: `
            <p>Dear ${firstname},</p>
            <p>Thank you for signing up with Unilodge Realty! To complete your registration, please verify your email address using the code below:</p>
            <p>Your verification code is: <b>${verificationCode}</b></p>
            <p>This code will expire in 10 minutes.</p>
            <p>If you didn't sign up for an account with Unilodge Realty, please ignore this email.</p>
            <p>Best regards,<br/>Unilodge Realty Team</p>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('New user verification email sent');
    } catch (error) {
        console.error('A mail error occurred:', error.message);
    }
};