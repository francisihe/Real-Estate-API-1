import mongoose from "mongoose";
import { MONGO_URL } from '../utils/variables.js';

export const connectToDatabase = async () => {
    try {
        await mongoose.connect(MONGO_URL);
        console.log('Connected to Mongo Database');
    } catch (error) {
        console.error('Error connecting to Mongo Database');
        //throw error;
    }
};