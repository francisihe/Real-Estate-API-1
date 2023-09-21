const express = require('express');
const app = express();
{/* --- --- --- */}

{/* --- --- --- */}
// Hardcoded data in data.js
const { Properties } = require('./data');

{/* --- --- --- */}
//Use JSON Objects within routes
app.use(express.json())

app.get('/', (req, res) => {

    // This route shows a default welcome note
    const welcomeNote =
        `Welcome to the Real Estate API. 
    To begin, you can navigate to 
    <p><a href="/properties">Properties</a></p>
    `
    res.status(200)
        .send(welcomeNote);
})

app.get('/about', (request, response) => {
    // This route will contain an about page and possibly mini doc for the API
    res.status(200)
        .send('<p>This is an about page</p>')
})

app.get('/properties', (req, res) => {

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
})

app.post('/properties', (req, res) => {

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
})

app.get('/properties/:propertyId', (req, res) => {

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
})

app.put('/properties/:propertyId', (req, res) => {

    // This route updates the features of a single property using PUT method
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
})

app.delete('/properties/:propertyId', (req, res) => {

    // This route deletes a property with the specified ID
    const { propertyId } = req.params;
    const singleProperty = Properties.find((property) => property.id === Number(propertyId))

    if (!singleProperty) {
        res
            .status(404)
            .send(`No property with ID ${propertyId} exists.`)
    }

    res.status(200)
    .json({status: true, message: `Property with ID ${propertyId} has been deleted`})
})

{/* --- --- --- */}
app.listen(8000, () => {
    console.log('API running on port 8000...')
})