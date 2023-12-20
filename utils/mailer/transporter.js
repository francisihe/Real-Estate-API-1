import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { EMAIL } from '../variables.js';
import { EMAIL_PASS } from '../variables.js';

// Load Environment Variables
dotenv.config();

// Nodemailer Transporter SMTP Config
export const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: EMAIL,
        pass: EMAIL_PASS,
    },
});
