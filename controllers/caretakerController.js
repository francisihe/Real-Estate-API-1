import mongoose from 'mongoose';
import Caretaker from '../models/caretakerModel.js'
import User from '../models/userModel.js'

export const getAllCaretakers = async (req, res, next) => {
    try {

        // Pagination parameters
        const page = parseInt(req.query.page) || 1;
        const minLimit = parseInt(req.query.limit) || 15;
        const maxLimit = 100;
        const limit = Math.min(minLimit, maxLimit);

        // Calculate the skip value based on the page and limit
        const skip = (page - 1) * limit;

        const caretakers = await Caretaker.find()
            .skip(skip)
            .limit(limit);

        res.status(200).json(caretakers);
    } catch (error) {
        next(error)
    }
};

export const getCaretaker = async (req, res, next) => {
    try {
        const caretaker = req.caretaker
        res.status(200).json(caretaker)
    } catch (error) {
        next(error)
    }
};

export const createCaretaker = async (req, res, next) => {

    try {
        //Check if a user exists with the email provided
        let user = await User.findOne({ email: req.body.email });
        let caretakerData = { ...req.body }
        //If user exists, it links the caretaker to the user, else it just creates new one as usual
        if (user) { caretakerData.userRef = user._id }
        const newCaretaker = await Caretaker.create(caretakerData);
        res.status(200).json(newCaretaker);
    } catch (error) {
        next(error)
    }
};

export const updateCaretaker = async (req, res, next) => {
    const caretaker = req.caretaker;
    try {
        const updatedCaretaker = await Caretaker.findByIdAndUpdate(
            caretaker,
            req.body,
            { new: true }
        )
        res.status(200).json(updatedCaretaker);
    } catch (error) {
        next(error)
    }
};

export const deleteCaretaker = async (req, res, next) => {
    try {
        const caretaker = req.caretaker;
        await Caretaker.findByIdAndDelete(caretaker);
        res.status(200).json('Caretaker has been deleted')
    } catch (error) {
        next(error)
    }
};

export const searchCaretakers = async (req, res, next) => {
    const searchTerm = req.query.searchTerm || '';
    try {
        const page = parseInt(req.query.page) || 1;
        const minLimit = parseInt(req.query.limit) || 15;
        const maxLimit = 100;
        const limit = Math.min(minLimit, maxLimit);
        const skip = (page - 1) * limit;

        let query;
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
        const caretaker = await Caretaker.find(query).skip(skip).limit(limit);
        if (caretaker.length === 0) { return res.status(404).json('Caretaker not found'); }
        res.status(200).json(caretaker);
    } catch (error) {
        next(error)
    }
};