import mongoose from 'mongoose';
import Booking from "../models/bookingModel.js";
import User from "../models/userModel.js";
import { newBookingCreatedEmail } from '../utils/mailer/newBookingCreatedEmail.js';

export const createBooking = async (req, res, next) => {
    try {
        //Check if a user exists with the email provided
        let user = await User.findOne({ email: req.body.email });
        let bookingData = { ...req.body }
        //If user exists, it links the booking to the user, else it just books for inspection as usual
        // if (user) { bookingData.userRef = user._id }
        if (user) {
            bookingData.userRef = user._id
        } else {
            bookingData.userRef = null
        }
        const newBooking = await Booking.create(bookingData);

        // Send email to admin
        await newBookingCreatedEmail(newBooking);
        res.status(201).json(newBooking);
    } catch (error) {
        next(error);
    }
};

export const getUserBookings = async (req, res, next) => {
    const { userId } = req.params;
    if (userId !== req.user.id) return res.status(403).json('Forbidden. You can only view your own bookings');

    try {

        // Pagination parameters
        const page = parseInt(req.query.page) || 1;
        const minLimit = parseInt(req.query.limit) || 15;
        const maxLimit = 100;
        const limit = Math.min(minLimit, maxLimit);

        // Calculate the skip value based on the page and limit
        const skip = (page - 1) * limit;

        const userBookings = await Booking.find({ userRef: userId }).skip(skip).limit(limit);
        const totalUserBookings = await Booking.find({ userRef: userId }).countDocuments();
        res.status(200).json({ userBookings, totalUserBookings });
    } catch (error) {
        if (error instanceof mongoose.Error.CastError) {
            return res.status(404).json('Invalid ID format');
        }
        next(error);
    }
};

export const getUserBookingsById = async (req, res, next) => {
    const { bookingId } = req.params;
    const { userId } = req.params;
    if (userId !== req.user.id) return res.status(403).json('Forbidden. You can only view your own bookings');

    try {
        const userBooking = await Booking.find({ _id: bookingId });
        // Booking returns an empty array when not found since it is a find method
        // and a booking is passed, which is truthy, hence the if statement equating to 0 indicating an empty array
        if (userBooking.length === 0) return res.status(404).json('Booking not found');
        res.status(200).json(userBooking);
    } catch (error) {
        if (error instanceof mongoose.Error.CastError) {
            return res.status(404).json('Invalid ID format');
        }
        next(error);
    }
};

export const getAllBookings = async (req, res, next) => {
    try {

        // Pagination parameters
        const page = parseInt(req.query.page) || 1;
        const minLimit = parseInt(req.query.limit) || 15;
        const maxLimit = 100;
        const limit = Math.min(minLimit, maxLimit);

        // Calculate the skip value based on the page and limit
        const skip = (page - 1) * limit;

        const bookings = await Booking.find()
            .skip(skip)
            .limit(limit);
        const totalBookings = await Booking.countDocuments();

        res.status(200).json({ bookings, totalBookings });
    } catch (error) {
        next(error);
    }
};

export const getTodaysBookings = async (req, res, next) => {
    try {

        // Pagination parameters
        const page = parseInt(req.query.page) || 1;
        const minLimit = parseInt(req.query.limit) || 15;
        const maxLimit = 100;
        const limit = Math.min(minLimit, maxLimit);

        // Calculate the skip value based on the page and limit
        const skip = (page - 1) * limit;

        const currentDate = new Date();

        // Set the time to the beginning of the day (00:00:00)
        const startOfDay = new Date(currentDate);
        startOfDay.setHours(0, 0, 0, 0);

        // Set the time to the end of the day (23:59:59)
        const endOfDay = new Date(currentDate);
        endOfDay.setHours(23, 59, 59, 999);

        //Bookings within this range
        const bookings = await Booking.find({
            inspectionDate: {
                $gte: startOfDay,
                $lt: endOfDay
            }
        }).skip(skip).limit(limit);

        const totalBookings = await Booking.countDocuments({
            inspectionDate: {
                $gte: startOfDay,
                $lt: endOfDay
            }
        });

        if (bookings.length === 0) return res.status(404).json('No booking found for today');
        res.status(200).json({bookings, totalBookings});
    } catch (error) {
        next(error);
    }
};

export const getBooking = async (req, res, next) => {
    const { bookingId } = req.params

    try {
        const booking = await Booking.findById(bookingId);
        if (!booking) return res.status;
        res.status(200).json(booking);
    } catch (error) {
        if (error instanceof mongoose.Error.CastError) {
            return res.status(404).json('Invalid ID format');
        }
        next(error);
    }
};

export const updateBooking = async (req, res, next) => {
    const { bookingId } = req.params;

    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json('Booking not found');

    try {
        const updateBooking = await Booking.findByIdAndUpdate(
            booking,
            req.body,
            { new: true }
        );
        res.status(200).json(updateBooking);
    } catch (error) {
        if (error instanceof mongoose.Error.CastError) {
            return res.status(404).json('Invalid ID format');
        }
        next(error);
    }
};

export const deleteBooking = async (req, res, next) => {
    const { bookingId } = req.params;

    try {
        const booking = await Booking.findByIdAndDelete(bookingId);
        if (!booking) return res.status(404).json('Booking not found');
        res.status(200).json("Booking has been deleted");
    } catch (error) {
        if (error instanceof mongoose.Error.CastError) {
            return res.status(404).json('Invalid ID format');
        }
        next(error);
    }
};

export const searchBookings = async (req, res, next) => {

    const searchTerm = req.query.searchTerm || '';
    let query;

    try {
        const page = parseInt(req.query.page) || 1;
        const minLimit = parseInt(req.query.limit) || 15;
        const maxLimit = 100;
        const limit = Math.min(minLimit, maxLimit);
        const skip = (page - 1) * limit;

        if (mongoose.Types.ObjectId.isValid(searchTerm)) {
            query = { _id: searchTerm };
        } else {
            query = {
                $or: [
                    { email: { $regex: searchTerm, $options: 'i' } },
                    { firstname: { $regex: searchTerm, $options: 'i' } },
                    { lastname: { $regex: searchTerm, $options: 'i' } },
                    { phone: { $regex: searchTerm, $options: 'i' } },
                ]
            }
        }
        const booking = await Booking.find(query).skip(skip).limit(limit);
        const totalBookings = await Booking.countDocuments(query);
        if (booking.length === 0) { return res.status(404).json('Booking not found'); }
        res.status(200).json({ booking, totalBookings });
    } catch (error) {
        next(error)
    }
};