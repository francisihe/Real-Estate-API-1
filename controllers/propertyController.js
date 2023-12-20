import mongoose from 'mongoose';
import Property from '../models/propertyModel.js';

export const getAllProperties = async (req, res, next) => {
    try {

        // Pagination parameters
        const page = parseInt(req.query.page) || 1;
        const minLimit = parseInt(req.query.limit) || 15;
        const maxLimit = 100;
        const limit = Math.min(minLimit, maxLimit);

        // Calculate the skip value based on the page and limit
        const skip = (page - 1) * limit;

        const properties = await Property.find()
            .skip(skip)
            .limit(limit);

        const totalProperties = await Property.countDocuments();

        if (properties.length === 0) return res.status(404).json('No properties found');
        res.status(200).json({ properties, totalProperties });

    } catch (error) {
        next(error);
    }
};

export const getFeaturedProperties = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const minLimit = parseInt(req.query.limit) || 15;
        const maxLimit = 100;
        const limit = Math.min(minLimit, maxLimit);
        const skip = (page - 1) * limit;

        const featuredProperties = await Property.find({ isFeatured: true })
            .skip(skip)
            .limit(limit);

        const totalFeaturedProperties = await Property.countDocuments({ isFeatured: true });

        if (featuredProperties.length === 0) return res.status(404).json('No featured properties found');
        res.status(200).json({ featuredProperties, totalFeaturedProperties });
    } catch (error) {
        next(error)
    }
};

export const getProperty = async (req, res, next) => {
    const { propertyId } = req.params;

    try {
        const property = await Property.findById(propertyId);
        if (!property) { return res.status(404).json('Property does not exist') };
        res.status(200).json(property);
    } catch (error) {
        if (error instanceof mongoose.Error.CastError) {
            return res.status(404).json('Invalid ID format');
        }
        next(error);
    }
};

export const createProperty = async (req, res, next) => {
    try {
        const newProperty = await Property.create(req.body);
        return res.status(201).json(newProperty);
    } catch (error) {
        next(error);
    }
};

export const updateProperty = async (req, res, next) => {
    const { propertyId } = req.params;

    const property = await Property.findById(propertyId);   //Check if property exists
    if (!property) { return res.json('Property does not exist') };

    try {
        const updateProperty = await Property.findByIdAndUpdate(
            propertyId,
            req.body,
            { new: true } // Returns the updated property
        );
        res.status(200).json(updateProperty);
    } catch {
        if (error instanceof mongoose.Error.CastError) {
            return res.status(404).json('Invalid ID format');
        }
        next(error);
    }
};

export const deleteProperty = async (req, res, next) => {
    const { propertyId } = req.params;

    try {
        const property = await Property.findByIdAndDelete(propertyId);
        if (!property) { return res.json('Property does not exist') }
        res.status(200).json('Property deleted successfully');
    } catch (error) {
        if (error instanceof mongoose.Error.CastError) {
            return res.status(404).json('Invalid ID format');
        }
        next(error);
    }
};

export const searchProperties = async (req, res, next) => {
    try {
        // Pagination parameters
        const page = parseInt(req.query.page) || 1;
        const minLimit = parseInt(req.query.limit) || 15;
        const maxLimit = 100;
        const limit = Math.min(minLimit, maxLimit);

        // Calculate the skip value based on the page and limit
        const skip = (page - 1) * limit;

        // Search term
        const searchTerm = req.query.searchTerm || '';

        // Regex search for name and description fields
        const regexSearch = new RegExp(searchTerm, 'i');

        // Price range
        const minPrice = parseFloat(req.query.minPrice) || 0;
        const maxPrice = parseFloat(req.query.maxPrice) || Number.MAX_VALUE;

        // Other terms
        const propertyType = req.query.propertyType || '';
        const propertyModel = req.query.propertyModel || '';
        const propertyStatus = req.query.propertyStatus || '';
        const propertyCategory = req.query.propertyCategory || '';

        // Sort options
        const sortField = req.query.sort || 'createdAt';
        const sortOrder = req.query.order || 'desc';

        // Construct the query dynamically based on provided parameters
        const query = {
            $or: [
                { title: { $regex: regexSearch } },
                { description: { $regex: regexSearch } },
                { address: { $regex: regexSearch } },
            ],
        };

        if (propertyType) {
            query.propertyType = { $regex: propertyType, $options: 'i' };
        }

        if (propertyModel) {
            query.propertyModel = { $regex: propertyModel, $options: 'i' };
        }

        if (propertyStatus) {
            query.propertyStatus = { $regex: propertyStatus, $options: 'i' };
        }

        if (propertyCategory) {
            query.propertyCategory = { $regex: propertyCategory, $options: 'i' };
        }

        // Query properties with pagination, search conditions, and sorting
        const properties = await Property.find(query)
            .sort({ [sortField]: sortOrder })
            .skip(skip)
            .limit(limit);

        const totalProperties = await Property.countDocuments(query);

        if (properties.length === 0) return res.status(404).json('No properties found');
        res.status(200).json({ properties, totalProperties });
    } catch (error) {
        next(error);
    }
};