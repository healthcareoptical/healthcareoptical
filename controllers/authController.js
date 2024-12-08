import * as authService from '../services/authService.js';
import { cookie } from '../config/config.js';

/**
 * Handles user login by verifying the user credentials and setting a JWT cookie.
 * 
 * This function uses the `authService.login` function to authenticate a user based on 
 * the provided user ID and password. If the authentication is successful, a JWT is 
 * created and sent to the client in a cookie. If authentication fails, an error response 
 * is returned to the client.
 * 
 * @async
 * @function login
 * @param {Object} req - The Express request object, containing the user credentials.
 * @param {Object} req.body - The body of the request containing user credentials.
 * @param {string} req.body.userId - The ID of the user attempting to log in.
 * @param {string} req.body.password - The password of the user attempting to log in.
 * @param {Object} res - The Express response object, used to send back the response to the client.
 * @param {function} next - The next middleware function in the Express pipeline.
 * 
 * @returns {void} - If successful, sends a 200 status with the user ID and roles in the response body.
 *                   If failure, calls `next` with an error object.
 * 
 * @throws {Error} - In case of any error, the error is passed to the next middleware.
 * 
 * @example
 * // Example usage of login function
 * app.post('/login', login);
 */
export async function login(req, res, next) {

    const response = await authService.login(req.body.userId, req.body.password);

    if (response.errorCode !== 0) {
        response.errorMessage = response.errorMessage || "Error Occurs";
        response.errorCode = response.errorCode || 500;
        return next(response);
    }

    res.cookie('jwt', response.refreshToken, cookie);
    res.status(200).json({ 'userId': response.userId, 'roles': response.roles });
}

/**
 * Handles user logout by clearing the JWT cookie.
 * 
 * This function clears the JWT cookie from the client's browser, effectively logging
 * the user out of the system. The client is then sent a confirmation message that the
 * logout was successful.
 * 
 * @async
 * @function logout
 * @param {Object} req - The Express request object. This function does not require any body content.
 * @param {Object} res - The Express response object, used to send back the response to the client.
 * @param {function} next - The next middleware function in the Express pipeline.
 * 
 * @returns {void} - Sends a 200 status with a success message confirming the logout.
 * 
 * @example
 * // Example usage of logout function
 * app.post('/logout', logout);
 */
export async function logout(req, res, next){
    res.clearCookie('jwt', cookie);
    res.status(200).json({ 'message' : 'Logout successfully' });
}