import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema({
    firstname:{
        type: String,
        required: [true, 'Please provide a firstname'],
    },
    lastname:{
        type: String,
        required: [true, 'Please provide a lastname'],
    },
    phone: {
        type: String,
        required: [true, 'Please provide a phone number'],
    },
    email: {
        type: String,
        required: [true, 'Please provide an email'],
    },
    inspectionDate: {
        type: Date,
        required: [true, 'Please provide a date'],
    },
    userRef: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    propertyRef: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Property',
    },
}, { timestamps: true });

const BookingModel = mongoose.model('Booking', BookingSchema);
export default BookingModel;