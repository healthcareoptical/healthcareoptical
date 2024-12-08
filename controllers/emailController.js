import { Resend } from 'resend';
import dotenv from 'dotenv';

dotenv.config();
/**
 * Sends an email using the Resend service.
 * 
 * This function sends an email to a predefined recipient using the Resend API.
 * The email's subject and message are provided through the request body.
 * If an error occurs during the email sending process, the error is handled 
 * and passed to the next middleware.
 * 
 * @async
 * @function sendEmail
 * @param {Object} req - The Express request object containing the email data.
 * @param {string} req.body.subject - The subject of the email (required).
 * @param {string} req.body.message - The body content of the email (required).
 * @param {Object} res - The Express response object used to send a response back to the client.
 * @param {function} next - The next middleware function to handle any errors.
 * 
 * @returns {void} - Sends a response with a success message if the email is sent successfully.
 * 
 * @throws {Error} - If an error occurs, the error is passed to the next middleware with a message and error code.
 * 
 * @example
 * // Example usage of sendEmail function
 * app.post('/send-email', sendEmail);
 */
export async function sendEmail(req, res, next) {

    const resend = new Resend(process.env.EMAIL_KEY);
    const subject = req.body.subject || null;
    const message = req.body.message || null;

    try {

        if (!subject) {
            const response = {};
            response.errorMessage = 'Missing subject';
            response.errorCode = 500;
            return next(response);
        }

        if (!message) {
            const response = {};
            response.errorMessage = 'Missing message';
            response.errorCode = 500;
            return next(response);
        }

        const { data, error } = await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: 'healthcareopticalhk@gmail.com',
            subject: subject,
            html: message
        });

        if (error){
            res.errorMessage = error.message;
            res.errorCode = error.statusCode;
            throw new Error('');
        }
    } catch (error) {
        const response = {};
        response.errorMessage = res.errorMessage || "Error Occurs";
        response.errorCode = res.errorCode || 500;
        return next(response);
    }
    
    res.status(200).json({ 'message': 'Email Sent' });
}
