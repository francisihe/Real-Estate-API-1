import { transporter } from './transporter.js';
import { EMAIL } from '../variables.js';

export const forgotPasswordEmail = async (email, verificationCode, firstname) => {
    const mailOptions = {
        from: `Unilodge Realty <${EMAIL}>`,
        to: email,
        bcc: 'unilodgeng103@gmail.com',
        subject: 'Unilodge Realty - Password Reset Request',
        html: `
            <p>Dear ${firstname},</p>
            <p>We received a request to reset your password. If you did not make this request, you can ignore this email.</p>
            <p>To reset your password, click on the link below and input this verification code <b>${verificationCode}</b>:</p>
            <p><a href="${`https://unilodge.com.ng/forgot-password`}" target="_blank">Reset Password</a></p>
            <p>Testing link: <a href="${`https://superb-custard-5c0981.netlify.app/forgot-password`}" target="_blank">Reset Password</a></p>
            <p>Your verification code will expire in 10 minutes for security reasons. If you need further assistance, please contact our support team.</p>
            <p>Best regards,<br/>Unilodge Realty Team</p>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Forgot password email sent');
    } catch (error) {
        console.error('A mail error occurred:', error.message);
    }
};