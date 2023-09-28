Notes to self: (Esp 3, 4, 7)

1. Add db and enable persisting of data
2. Refactor to use MVC pattern
3. Update port, add 'dotenv' dependency
4. Include a data type checker in the API for POST request on route (/api/properties) or on the frontend

    (a) Use the middleware

    const { body, validationResult } = require('express-validator');

    // Create a validation middleware for a POST request to create a property
    const createPropertyValidator = [
    body('id').isNumeric(),
    body('propertyStatus').isString(),
    body('type').isString(),
    // Add validation checks for other properties here
    ];

    // Use the validation middleware in your route handler
    app.post('/api/properties', createPropertyValidator, (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    // If validation passes, proceed with creating the property
    // ...
    });


    or  (b) Use JS's data typeof checker

    app.post('/api/properties', createPropertyValidator, (req, res) => {
    const { id, propertyStatus, type, category, price } = req.body;

    if (typeof id !== 'number' || typeof propertyStatus !== 'string') {
        return res.status(400).json({ error: 'Invalid data types in request.' });
    }

    // Perform more specific data type checks for other properties as needed

    // If data type checks pass, proceed with creating the property
    // ...
    });


5.  When db is connected, check that PUT method in route (/properties/id) works as expected

6.  Remove the 'id' in all POST routes after connecting db as it will be AUTO_INCREMENT

7.  Paginate and limit the number of results per query using:

    app.get('/properties', (req, res) => {
    // Extract query parameters for pagination
    const { page = 1, perPage = 10 } = req.query;
    
    // Convert page and perPage to numbers
    const pageNumber = parseInt(page);
    const propertiesPerPage = parseInt(perPage);

    // Calculate the starting index for pagination
    const startIndex = (pageNumber - 1) * propertiesPerPage;
    const endIndex = startIndex + propertiesPerPage;

    // Slice the properties array to get the properties for the current page
    const propertiesForPage = Properties.slice(startIndex, endIndex);

    // Check if there are more pages
    const hasMore = endIndex < Properties.length;

    // Return the properties for the current page along with pagination information
    res.status(200).json({
        success: true,
        data: propertiesForPage,
        pageInfo: {
        currentPage: pageNumber,
        propertiesPerPage,
        totalProperties: Properties.length,
        hasMore,
        },
    });
    });

8.  Work on auth route
9.  Install mongoose, setup MongoDB