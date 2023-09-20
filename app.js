const express = require('express');
const app = express();
const { Properties } = require('./data');
// import { Properties } from './data.js';

app.get('/', (req, res) => {

    // This route shows a default welcome note
    const welcomeNote =
        `Welcome to the Real Estate API. 
    To begin, you can navigate to 
    <p><a href="/properties">Properties</a></p>
    `
    res.send(welcomeNote);
})

app.get('/about', (request, response) => {
    // This route will contain an about page and possibly mini doc for the API
    res.send('<p>This is an about page</p>')
})

app.get('/properties', (req, res) => {

    //This route returns only minimal details used to populate the property cards
    //These are the id, title, propertyStatus, price and featured image

    const miniDetails = Properties.map((property) => {
        const { id, title, propertyStatus, price, images } = property;
        const featuredImage = images[0];
        return { id, title, propertyStatus, price, featuredImage }
    })

    res.json(miniDetails)
})

app.post('/properties', (req, res) => {
    // This route adds new property using POST method
    
    const newProperty = {id, propertyStatus, type} = req.body;

    if (!id, propertyStatus) {
        return res.send('Please input details of property')
    }

    res.send('Test')
})

app.get('/properties/:propertyId', (req, res) => {

    //This route returns all the available data for a specific property using unique identifier of ID

    const { propertyId } = req.params
    const singleProperty = Properties.find((property) => property.id === Number(propertyId))
    return res.json(singleProperty)
})

app.listen(8000, () => {
    console.log('API running on port 8000...')
})