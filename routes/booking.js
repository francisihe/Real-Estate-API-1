import express from 'express';
import {
    createBooking, getUserBookings, getUserBookingsById,
    getAllBookings, getBooking, updateBooking, deleteBooking, searchBookings, getTodaysBookings
} from '../controllers/bookingController.js';
import { verifyManagerOrAdmin } from "../middlewares/verifyManagerOrAdmin.js"
import { verifyUser } from '../middlewares/verifyUser.js';
const router = express.Router();

//Create a booking
router.route('/create')
    .post(createBooking)

//Get all bookings of a specific user
router.route('/all/users/:userId')
    .get(verifyUser, getUserBookings)

//Get a user booking by booking id
router.route('/:bookingId/users/:userId')
    .get(verifyUser, getUserBookingsById)


// Manager or Admins Below

//Get all bookings as admin or manager
router.route('/all')
    .get(verifyManagerOrAdmin, getAllBookings)

// Get Today's Bookings
router.route('/today')
    .get(verifyManagerOrAdmin, getTodaysBookings);

router.route('/search')
    .get(verifyManagerOrAdmin, searchBookings);

//Get a booking by booking id as admin or manager
router.route('/:bookingId')
    .get(verifyManagerOrAdmin, getBooking)
    .patch(verifyManagerOrAdmin, updateBooking)
    .delete(verifyManagerOrAdmin, deleteBooking)

export default router;