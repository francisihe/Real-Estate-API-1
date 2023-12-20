import User from '../models/userModel.js';
import Property from '../models/propertyModel.js';
import Booking from '../models/bookingModel.js';

export const getSummaryNumbers = async (req, res, next) => {
    try {

        const totalUsers = await User.countDocuments();
        const totalProperties = await Property.countDocuments();
        const totalFeaturedProperties = await Property.countDocuments({ isFeatured: true });
        const totalBookings = await Booking.countDocuments();

        res.status(200).json({
            totalUsers,
            totalProperties,
            totalFeaturedProperties,
            totalBookings
        });
    } catch (error) {
        next(error);
    }
};