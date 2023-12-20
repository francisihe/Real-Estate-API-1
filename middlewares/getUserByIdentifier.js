import mongoose from 'mongoose';
import User from '../models/userModel.js';

export const getUserByIdentifier = async (req, res, next) => {
    const { userId } = req.params;
    const isEmail = userId.includes('@');

    try {
        if (isEmail) {
            const user = await User.findOne({ email: userId });
            if (user) { req.user = user}
            else { return res.status(404).json({ error: 'User not found', message: 'User with the provided email does not exist' })}
    
        } else {
            const isValidUserObjectId = (mongoose.Types.ObjectId.isValid(userId));
            
            if (isValidUserObjectId) {
                const user = await User.findById(userId);
                if (user) { req.user = user}
                else { return res.status(404).json({ error: 'User not found', message: 'User with the provided ID does not exist' })}
            } else {
                return res.status(400).json({ error: 'Invalid ID format', message: 'The provided ID is not a valid ObjectId' })
            }
        }
    
        next();
    } catch (error) {
        next(error);
    }
};