import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors'

import authRouter from './routes/auth.js'
import propertyRouter from './routes/property.js'
import bookingRouter from './routes/booking.js'
import userRouter from './routes/user.js'
import caretakerRouter from './routes/caretaker.js'
import summaryRouter from './routes/summary.js'
import blogRouter from './routes/blog.js'
import { connectToDatabase } from './db/connectdb.js';

const app = express(); // Express App
dotenv.config(); // Environment Variables

app.use((express.json())); // Body Parser
app.use(cookieParser());   // Cookie Parser
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174'],
    credentials: true,
})); // CORS -- // Add allowed frontend domains to the array

// Test Route
app.get('/test', (req, res) => {
    res.send('Hello World');
})

// Routes
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/properties', propertyRouter)
app.use('/api/v1/bookings', bookingRouter)
app.use('/api/v1/users', userRouter)
app.use('/api/v1/caretakers', caretakerRouter)
app.use('/api/v1/summary', summaryRouter)
app.use('/api/v1/blogs', blogRouter)

// Port and DB Connection for localhost development
const port = process.env.PORT || 3000; 
app.listen(port, async () => {
    try {
        try {
            await connectToDatabase();
            console.log(`Server running on port ${port}`);
        } catch (error) {
            if (error) {
                console.log('Error connecting to Mongo Database');
                throw error;
            }
        }
    } catch (error) {
        if (error) throw error;
    }
});


// Port and DB Connection for production on Firebase Functions
app.listen(async () => {
    try {
        await connectToDatabase();
    } catch (error) {
        if (error) {
            console.log(error)
        };
    }
});