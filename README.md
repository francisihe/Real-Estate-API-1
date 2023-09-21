# Real Estate API

The Real Estate API is a Node.js and Express.js-powered API created by Francis Ihejirika. This API serves as a test API designed to power a real estate application. It provides endpoints to manage different property types, including houses and lands. 

It's still under development so be sure to manage, edit and update to fit your preference

![Real Estate API Screenshot](<public/images/Screenshot from 2023-09-21 04-00-21.png>)

## Getting Started
**Prerequisites**
Before you begin, ensure you have met the following requirements:

Node.js and npm installed on your machine.
Git for version control (optional but recommended).
Installation
To set up and run the Real Estate API locally, follow these steps:

### **Clone the repository:**

`git clone https://github.com/francisihejirika/real-estate-api.git`

Change to the project directory:

`cd real-estate-api`

Install dependencies:

`npm install`

Start the server:

`npm start`
The API will be running locally at http://localhost:3000 or http://localhost:8000. Please check the current port, preverably setup your own .env file and indicate your preferred port cause this was 8000 at the time of this upload.


# Mini Documentation

Below are basic definitions of each route.

## Properties Routes

The Properties Routes allow you to perform various operations related to properties in the application. This section provides an overview of the available routes and their associated actions.

### Retrieve All Properties

- **Route**: `GET /properties`
- **Controller Function**: `getAllProperties`

This route retrieves a list of all properties currently available in the application.

### Create a New Property

- **Route**: `POST /properties`
- **Controller Function**: `createProperty`

Use this route to create a new property by providing the necessary property details in the request body.

### Retrieve a Specific Property

- **Route**: `GET /properties/:propertyId`
- **Controller Function**: `getProperty`

This route allows you to retrieve the details of a specific property identified by its unique `propertyId`.

### Update a Property

- **Route**: `PUT /properties/:propertyId`
- **Controller Function**: `updateProperty`

Use this route to update the details of an existing property. Provide the `propertyId` in the URL and the updated property data in the request body.

### Delete a Property

- **Route**: `DELETE /properties/:propertyId`
- **Controller Function**: `deleteProperty`

This route allows you to delete a property based on its `propertyId`.

**Note**: Ensure that you provide the appropriate request data and permissions when interacting with these routes. Refer to the respective controller functions for detailed information on the expected request payloads and responses.
