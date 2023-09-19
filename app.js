const express = require('express');
const app = express();
const { Properties } = require('./data');
// import { Properties } from './data.js';

app.get('/', (req, res) => {
    const welcomeNote = 
    `Welcome to the Real Estate API. 
    To begin, you can navigate to 
    <p><a href="/properties">Properties</a></p>
    `
    res.send(welcomeNote);
})

app.get('/properties', (req, res)=> {
    
    const miniDetails = Properties.map((property) => {
        const {id, title, status, price, images} = property;
        const featuredImage = images[0];
        return {id, title, status, price, featuredImage}
    })

    res.json(miniDetails)
})

app.get('/properties/:propertyId', (req, res) => {
    const {propertyId} = req.params
    const singleProperty = Properties.find((property) => property.id === Number(propertyId))
    return res.json(singleProperty)
})

app.listen(8000, () => {
    console.log('API running on port 8000...')
})