import { transporter } from './transporter.js';
import { EMAIL } from '../variables.js';

export const newUserGoogleSignUpEmail = async (email, firstname) => {
    const mailOptions = {
        from: `Unilodge Realty <${EMAIL}>`,
        to: email,
        subject: 'Welcome to Unilodge Realty - Account Created!',
        html: `
            <p>Dear ${firstname},</p>

            <p>Welcome to Unilodge Realty! Your account has been successfully created and automatically verified.</p
            <p>You can now log in to our platform and start exploring our services.</p>
            <p>If you have any questions or need assistance, feel free to contact our support team at support@unilodge.com.ng</p>
            <p>Thank you for choosing Unilodge Realty!</p>
            <p>Best regards,<br/>Unilodge Realty Team</p>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('New Google user sign-up email sent');
    } catch (error) {
        console.error('A mail error occurred:', error.message);
    }
};