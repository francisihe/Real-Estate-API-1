{/* --- --- --- */ }
// Hardcoded data in data.js
const { Properties } = require('../data');

{/* --- --- Get All Properties Controller using GET Method --- --- */}
const getAllProperties = (req, res) => {

    //This route returns only minimal details used to populate the property cards
    //These are the id, title, propertyStatus, price and featured image

    const miniDetails = Properties.map((property) => {
        const { id, title, propertyStatus, price, images } = property;
        const featuredImage = images[0];
        return { id, title, propertyStatus, price, featuredImage }
    })

    res
        .status(200)
        .json({ success: true, data: miniDetails })
};

{/* --- --- Create Single Property Controller using POST Method --- --- */}
const createProperty = (req, res) => {

    // This route adds new property using POST method requiring the following details

    const newProperty = {
        id,
        propertyStatus,
        type,
        category,
        title,
        description,
        price,
        discountPrice,
        discountPercentage,
        location,
        bedrooms,
        bathrooms,
        size,
        images,
        features
    } = req.body;

    if (!id || !propertyStatus || !type || !category || !title || !price) {
        return res.send('Please input details of property')
    }

    res
        .status(200)
        .json({ success: true, data: newProperty })
};

{/* --- --- Get Single Property with ID Controller using GET Method --- --- */}
const getProperty = (req, res) => {

    //This route returns all the available data for a specific property using unique identifier of ID

    const { propertyId } = req.params
    const singleProperty = Properties.find((property) => property.id === Number(propertyId))

    if (!singleProperty) {
        return res
            .status(404)
            .send(`No property with ID ${propertyId} exists.`)
    }

    res.status(200)
        .json({ success: true, data: singleProperty })
};

{/* --- --- Update Single Property with ID Controller using PUT Method --- --- */}
const updateProperty = (req, res) => {

    const { propertyId } = req.params;
    const { updatedProperty } = req.body;

    const singleProperty = Properties.find((property) => property.id === Number(propertyId))
    // OR const singlePropertyIndex = Properties.findIndex((property) => property.id === Number(propertyId));


    if (singleProperty) {
        // Update the property with details
        Properties[singleProperty] = {          // OR Properties[singlePropertyIndex] = {
            ...Properties[singleProperty],      //...Properties[singlePropertyIndex],
            ...updatedProperty                  //...updatedProperty,
        };                                       // };

        return res.status(200)
            .json({ success: true, data: Properties[propertyId] }) //OR Properties[singlePropertyIndex]

    } else {
        return res
            .status(404)
            .send(`No property with ID ${propertyId} exists.`)
    }
};

{/* --- --- Delete Single Property with ID Controller using DELETE Method --- --- */}
const deleteProperty = (req, res) => {

    const { propertyId } = req.params;
    const singleProperty = Properties.find((property) => property.id === Number(propertyId))

    if (!singleProperty) {
        res
            .status(404)
            .send(`No property with ID ${propertyId} exists.`)
    }

    res.status(200)
        .json({ status: true, message: `Property with ID ${propertyId} has been deleted` })
};

module.exports = {
    getAllProperties,
    createProperty,
    getProperty,
    updateProperty,
    deleteProperty
}