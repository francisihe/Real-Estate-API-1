// For use on localhost or environments that allow .env variables

import dotenv from 'dotenv';
dotenv.config();

export const MONGO_URL = process.env.MONGO_URL;
export const JWT_SECRET = process.env.JWT_SECRET;
export const EMAIL = process.env.EMAIL;
export const EMAIL_PASS = process.env.EMAIL_PASS;
export const BLOG_URL = process.env.BLOG_URL;




// For use on firebase cloud functions

// import functions from 'firebase-functions';

// export const MONGO_URL = functions.config().mongo.url;
// export const JWT_SECRET = functions.config().jwt.secret;
// export const EMAIL = functions.config().email.user;
// export const EMAIL_PASS = functions.config().email.pass;
// export const BLOG_URL = functions.config().blog.url;