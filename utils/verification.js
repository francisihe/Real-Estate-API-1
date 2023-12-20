export const generateVerificationCode = async (req, res, next) => {
    // Generate a random 6 digit number
    const verificationCode =  Math.floor(100000 + Math.random() * 900000).toString();

    // Set the expiration time for the code - 10 minutes
    const currentDate = new Date();
    const expirationTime = new Date(currentDate.getTime() + 10 * 60000);
    
    return { verificationCode, expirationTime };
}