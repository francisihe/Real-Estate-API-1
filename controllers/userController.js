import mongoose from 'mongoose';
import User from '../models/userModel.js';
import bcryptjs from 'bcryptjs';

export const getUser = async (req, res, next) => {
    const { userId } = req.params;
    if (req.user.id !== userId) return res.status(403).json({ message: 'You can only view your own profile' });

    try {
        const user = await User.findById(userId).select('-password');
        res.status(200).json(user);
    } catch (error) {
        next(error)
    }
};

export const updateUser = async (req, res, next) => {
    const { userId } = req.params;
    if (req.user.id !== userId) return res.status(403).json('You can only update your own profile');

    // Implemented pasword reset route already with email verification so this is not needed for extra security
    // if (req.body.password) {
    //     const updatedPassword = bcryptjs.hashSync(req.body.password, 10);
    //     req.body.password = updatedPassword;
    // }

    //Check username availability
    if (req.body.username) {
        const alreadyExistingUsername = await User.findOne({ username: req.body.username });
        if (alreadyExistingUsername) { return res.status(400).json('Username has been taken. Please try another') };
    }

    try {
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            req.body,
            { new: true }).select('-password');;
        res.status(200).json(updatedUser);
    } catch (error) {
        next(error);
    }
};

export const getAllUsers = async (req, res, next) => {
    try {

        // Pagination parameters
        const page = parseInt(req.query.page) || 1;
        const minLimit = parseInt(req.query.limit) || 15;
        const maxLimit = 100;
        const limit = Math.min(minLimit, maxLimit);

        // Calculate the skip value based on the page and limit
        const skip = (page - 1) * limit;

        const users = await User.find({})
            .select('-password')
            .skip(skip)
            .limit(limit);

        const totalUsers = await User.countDocuments();
        res.status(200).json({ users, totalUsers });
    } catch (error) {
        next(error)
    }
};

export const getUserById = async (req, res, next) => {
    try {
        // User has already been defined in the getUserByIdentifier middleware
        const user = req.user;
        const { password, ...userDoc } = user._doc;
        res.status(200).json(userDoc);
    } catch (error) {
        next(error);
    }
};

export const updateUserAsAdmin = async (req, res, next) => {
    try {
        // User has already been defined in the getUserByIdentifier middleware
        const user = req.user;

        if (req.body.password) {
            const updatedPassword = bcryptjs.hashSync(req.body.password, 10);
            req.body.password = updatedPassword;
        }

        const updatedUser = await User.findByIdAndUpdate(
            user,
            req.body,
            { new: true }).select('-password');
        res.status(200).json(updatedUser);
    } catch (error) {
        next(error);
    }
};

export const deleteUser = async (req, res, next) => {
    try {
        // Logic already in getUserByIdentifier middleware
        const user = req.user;
        await User.findOneAndDelete(user)
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        next(error)
    }
};

// Search users using firstname, lastname, username, email or id
export const searchUsers = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const minLimit = parseInt(req.query.limit) || 15;
        const maxLimit = 100;
        const limit = Math.min(minLimit, maxLimit);
        const skip = (page - 1) * limit;

        // Search term
        const searchTerm = req.query.searchTerm || '';

        let query;
        if (mongoose.Types.ObjectId.isValid(searchTerm)) {
            query = { _id: searchTerm };
        } else {
            const regexSearch = new RegExp(searchTerm, 'i');
            query = {
                $or: [
                    { email: { $regex: regexSearch } },
                    { firstname: { $regex: regexSearch } },
                    { lastname: { $regex: regexSearch } },
                    { username: { $regex: regexSearch } },
                ],
            };
        };

        const users = await User.find(query)
            .select('-password')
            .skip(skip).limit(limit);
        if (users.length === 0) return res.status(404).json('No users found');
        const totalUsers = await User.countDocuments(query);

        res.status(200).json({ users, totalUsers });
    } catch (error) {
        next(error);
    }
};