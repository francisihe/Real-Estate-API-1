const express = require('express');
const app = express();

{/* --- --- Imported Properties Router --- --- */ }
const propertiesRouter = require('./routes/properties')

{/* --- --- Enable JSON to be used within Routes --- --- */}
//Use JSON Objects within routes
app.use(express.json())

{/* --- --- Defined Properties Route via Router --- --- */}
app.use('/properties', propertiesRouter)

{/* --- --- Home Route --- --- */}
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

{/* --- --- About Route --- --- */}
app.get('/about', (req, res) => {
    // This route will contain an about page and possibly mini doc for the API
    res.status(200)
        .send('<p>This is an about page</p>')
})



{/* --- --- API Listening Port--- --- */}
app.listen(8000, () => {
    console.log('API running on port 8000...')
})