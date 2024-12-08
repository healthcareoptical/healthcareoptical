import { Router } from "express";
import * as emailController from '../controllers/emailController.js';

const emailRoute = Router();

/**
 * Route: POST /
 *
 * Sends an email.
 *
 * @function
 * @name sendEmail
 * @memberof module:emailRoute
 * @inner
 * @param {Object} req - Express request object containing email details in the request body.
 * @param {Object} res - Express response object that confirms the email sending status.
 * @description Calls the `sendEmail` function from `emailController` to send an email.
 *
 * @example
 * // Request Body:
 * {
 *   "to": "recipient@example.com",
 *   "subject": "Hello, world!",
 *   "body": "This is a test email."
 * }
 *
 * // Response (Success):
 * {
 *   "errorCode": 0,
 *   "errorMessage": "",
 *   "message": "Email sent successfully"
 * }
 *
 * // Response (Failure):
 * {
 *   "errorCode": 500,
 *   "errorMessage": "Error occurs while sending email"
 * }
 */
emailRoute.route('/')
    .post(emailController.sendEmail)

export default emailRoute;    