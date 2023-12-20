import { transporter } from './transporter.js';
import { EMAIL } from '../variables.js';

const formatDate = (dateString) => {
    const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
};

export const newBookingCreatedEmail = async (newBooking) => {
    const mailOptions = {
        from: `Unilodge Realty <${EMAIL}>`,
        to: 'unilodgeng103@gmail.com',
        subject: 'New Booking Created',
        html: `
            <p>Hello admin,</p>
            <br />
            <p>A new booking has been created. You can login to the admin dashboard to see the details</p>
            <p>Here is a summary of the booking:</p>
            <p>Customer: ${newBooking.firstname} ${newBooking.lastname}</p>
            <p>Customer phone: ${newBooking.phone}</p>
            <p>Customer email: ${newBooking.email}</p>
            <p>Inspection date: ${formatDate(newBooking.inspectionDate)}</p>
            <p>Property ID: ${newBooking.propertyRef}</p>

            <p>Best regards,<br/>Unilodge Realty Team</p>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('New booking created email sent');
    } catch (error) {
        console.error('A mail error occurred:', error.message);
    }
};