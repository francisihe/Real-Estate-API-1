import { transporter } from './transporter.js';
import { EMAIL } from '../variables.js';

export const resetPasswordEmail = async (email, firstname) => {
    const mailOptions = {
        from: `Unilodge Realty <${EMAIL}>`,
        to: email,
        subject: 'Unilodge Realty - Password Reset Successful',
        html: `
            <p>Dear ${firstname},</p>
            <p>Your password has been successfully reset. If you did not make this change, please contact our support team immediately.</p>
            <p>If you have any further questions or need assistance, feel free to reach out to us at support@unilodgerealty.com.</p>
            <p>Thank you for choosing Unilodge Realty!</p>
            <p>Best regards,<br/>Unilodge Realty Team</p>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Password reset confirmation email sent');
    } catch (error) {
        console.error('A mail error occurred:', error.message);
    }
};