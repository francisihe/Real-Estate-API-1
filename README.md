# Real Estate API

The Real Estate API is a Node.js and Express.js-powered API created by Francis Ihejirika. This API serves as a test API designed to power a real estate application. It provides endpoints to manage different property types, including houses and lands.

It was created for a real estate company Unilodge that offers real estate services such as sale of lands, houses and rental of same. 

It also offers administrative functionalities for managing users and properties, while managers can oversee both properties and users effectively. The webapp utilizes WordPress as the Content Management System for its blog, which is deployed on a subdomain, and utilizes WooCommerce for its shop page also deployed on a sub domain.

The backend of this project, in addition to the other functionalities listed above, has a separate route to query the REST API for the WordPress blog, pulling in only the required data.

The backend also employs a mail verification system that generates a 6-digit code for new user sign ups, verification of signed up users but unverified users, resetting of password and notifying a specific admin email when there are new bookings.

It's still under development so be sure to manage, edit and update to fit your preference

## Project Owner

- Francis Ihejirika (Fullstack Developer)
- Email: francis.ihejirika@gmail.com
- Twitter: @francisihej
- Phone/WhatsApp: +2348165148492 / +1(469)892-8855

![Real Estate API Screenshot](<public/images/Screenshot from 2023-09-21 04-00-21.png>)

![Real Estate API Screenshot 2](<public/images/Screenshot from 2023-12-20 23-38-39.png>)

## Getting Started
**Prerequisites**
Before you begin, ensure you have met the following requirements:

Node.js and npm installed on your machine.
Git for version control (optional but recommended).
Installation
To set up and run the Real Estate API locally, follow these steps:

### **Clone the repository:**

`git clone https://github.com/francisihe/Real-Estate-API-1`

Change to the project directory:

`cd Real-Estate-API-1`

Install dependencies:

`npm install`

Start the server:

`npm start`
The API will be running locally at http://localhost:3000 or http://localhost:8000. Please check the current port, preverably setup your own .env file and indicate your preferred port cause this was 8000 at the time of this upload.


# Real Estate Management System API Mini Documentation

This mini documentation provides detailed information on the available routes and their associated actions in the Real Estate Management System API.

## User Management Routes

### Register New User via Email/Password

- **Route**: `POST /api/users/register`
- **Controller Function**: `registerUser`

This route allows the registration of a new user by providing email and password information in the request body.

### Sign In User via Email and Password

- **Route**: `POST /api/users/signin`
- **Controller Function**: `signInUser`

Use this route to authenticate a user by providing email and password credentials in the request body.

### Verify User via Code (User)

- **Route**: `POST /api/users/verify`
- **Controller Function**: `verifyUser`

Verify a user's identity using a verification code provided in the request.

### Resend Verification Code

- **Route**: `POST /api/users/resend-verification`
- **Controller Function**: `resendVerificationCode`

Resend the verification code to the user's email address for identity confirmation.

### Forgot Password (User)

- **Route**: `POST /api/users/forgot-password`
- **Controller Function**: `forgotPassword`

Initiate the process of resetting a user's password by providing the associated email address.

### Reset Password (User)

- **Route**: `POST /api/users/reset-password`
- **Controller Function**: `resetPassword`

Reset the user's password using a valid reset token and the new password in the request.

### Get User (User)

- **Route**: `GET /api/users`
- **Controller Function**: `getUser`

Retrieve information about the authenticated user.

### Update User (User)

- **Route**: `PATCH /api/users`
- **Controller Function**: `updateUser`

Update the authenticated user's information.

### Get All Users (Admins)

- **Route**: `GET /api/users/all`
- **Controller Function**: `getAllUsers`

Retrieve a list of all users in the system (Admins only).

### Search Users (Admin)

- **Route**: `GET /api/users/search`
- **Controller Function**: `searchUsers`

Search for users based on specified criteria (Admins only).

### Get Single User By ID (Admin)

- **Route**: `GET /api/users/:id`
- **Controller Function**: `getSingleUserById`

Retrieve information about a specific user by ID (Admins only).

### Update Single User As Admin (Admin)

- **Route**: `PATCH /api/users/:id`
- **Controller Function**: `updateSingleUserAsAdmin`

Update a specific user's information as an administrator (Admins only).

### Delete Single User As Admin

- **Route**: `DELETE /api/users/:id`
- **Controller Function**: `deleteSingleUserAsAdmin`

Delete a specific user as an administrator (Admins only).

## Property Management Routes

### Get All Properties

- **Route**: `GET /api/properties`
- **Controller Function**: `getAllProperties`

This route retrieves a list of all properties currently available in the application.

### Get Featured Properties

- **Route**: `GET /api/properties/featured`
- **Controller Function**: `getFeaturedProperties`

Retrieve a list of featured properties in the application.

### Search Properties

- **Route**: `GET /api/properties/search`
- **Controller Function**: `searchProperties`

Search for properties based on specified criteria.

### Get Single Property By ID

- **Route**: `GET /api/properties/:id`
- **Controller Function**: `getSinglePropertyById`

Retrieve details of a specific property by its unique ID.

### Create New Property (Manager or Admin)

- **Route**: `POST /api/properties`
- **Controller Function**: `createProperty`

Create a new property by providing the necessary details in the request body (Managers or Admins only).

### Update Single Property (Manager or Admin)

- **Route**: `PATCH /api/properties/:id`
- **Controller Function**: `updateSingleProperty`

Update details of an existing property by providing the property ID and updated data (Managers or Admins only).

### Delete Property (Manager or Admin)

- **Route**: `DELETE /api/properties/:id`
- **Controller Function**: `deleteProperty`

Delete a specific property by providing its ID (Managers or Admins only).

These routes are designed to manage user and property-related operations within the Real Estate Management System. Ensure you provide the appropriate data and permissions when interacting with these routes. Refer to the respective controller functions for detailed information on expected request payloads and responses.
