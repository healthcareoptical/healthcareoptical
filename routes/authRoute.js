import { Router } from "express";
import * as authController from '../controllers/authController.js';

const authRoute = Router();

/**
 * Route: POST /login
 *
 * Handles user login requests.
 *
 * @function
 * @name login
 * @memberof module:authRoute
 * @inner
 * @param {Object} req - Express request object containing user credentials in the request body.
 * @param {Object} res - Express response object that sends the login result.
 * @description Calls the `login` function from `authController` to process user authentication.
 *
 * @example
 * // Request Body:
 * {
 *   "userId": "john_doe",
 *   "password": "password123"
 * }
 *
 * // Response (Success):
 * {
 *   "errorCode": 0,
 *   "refreshToken": "eyJhbGciOiJIUzI1...",
 *   "userId": "john_doe",
 *   "roles": ["Admin", "Editor"]
 * }
 *
 * // Response (Failure):
 * {
 *   "errorCode": 401,
 *   "errorMessage": "Invalid user id and password"
 * }
 */
authRoute.route('/login').
    post(authController.login);

/**
 * Route: POST /logout
 *
 * Handles user logout requests.
 *
 * @function
 * @name logout
 * @memberof module:authRoute
 * @inner
 * @param {Object} req - Express request object, typically containing the user's session or token to invalidate.
 * @param {Object} res - Express response object that confirms the logout result.
 * @description Calls the `logout` function from `authController` to process user logout and session invalidation.
 *
 * @example
 * // Request Body:
 * {}
 *
 * // Response:
 * {
 *   "errorCode": 0,
 *   "errorMessage": "Logout successful"
 * }
 */

authRoute.route('/logout').
    post(authController.logout);

export default authRoute;    