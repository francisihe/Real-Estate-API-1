import mongoose from 'mongoose';
import Caretaker from '../models/caretakerModel.js'

export const getCaretakerByIdentifier = async (req, res, next) => {
    const { caretakerId } = req.params;
    const isEmail = caretakerId.includes('@');

    try {
        if (isEmail) {
            const caretaker = await Caretaker.findOne({ email: caretakerId });
            if (caretaker) { req.caretaker = caretaker}
            else { return res.status(404).json({ error: 'Caretaker not found', message: 'caretaker with the provided email does not exist' })}
    
        } else {
            const isValidObjectId = (mongoose.Types.ObjectId.isValid(caretakerId));
            
            if (isValidObjectId) {
                const caretaker = await Caretaker.findById(caretakerId);
                if (caretaker) { req.caretaker = caretaker}
                else { return res.status(404).json({ error: 'Caretaker not found', message: 'Caretaker with the provided ID does not exist' })}
            } else {
                return res.status(400).json({ error: 'Invalid ID format', message: 'The provided ID is not a valid ObjectId' })
            }
        }
    
        next();
    } catch (error) {
        next(error);
    }
}