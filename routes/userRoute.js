import { Router } from "express";
import * as userController from '../controllers/userController.js';

const userRoute = Router();

/**
 * Route: GET /
 *
 * Fetches a list of users.
 *
 * @function
 * @name getUsers
 * @memberof module:userRoute
 * @inner
 * @param {Object} req - Express request object, which may include query parameters for filtering users.
 * @param {Object} res - Express response object containing the list of users.
 * @description This route fetches a list of users, optionally filtered by query parameters (e.g., by user ID). It returns the user data excluding sensitive information like passwords and roles.
 *
 * @example
 * // Request:
 * GET /user?userId=123
 *
 * // Response (Success):
 * {
 *   "errorCode": 0,
 *   "errorMessage": "",
 *   "users": [
 *     { "userId": "123", "name": "John Doe", "email": "johndoe@example.com" }
 *   ]
 * }
 *
 * // Response (Failure - No User Found):
 * {
 *   "errorCode": 404,
 *   "errorMessage": "No user found"
 * }
 *
 * Route: POST /
 *
 * Creates a new user.
 *
 * @function
 * @name createUser
 * @memberof module:userRoute
 * @inner
 * @param {Object} req - Express request object, which contains user data (e.g., `userId`, `password`, and `roleNames`).
 * @param {Object} res - Express response object containing the status of user creation.
 * @description This route creates a new user by sending the user data (user ID, password, and role information). It checks if the user and roles exist and returns the appropriate status message.
 *
 * @example
 * // Request:
 * POST /user
 * // Body:
 * {
 *   "userId": "newuser123",
 *   "password": "password123",
 *   "roleNames": ["admin", "user"]
 * }
 *
 * // Response (Success):
 * {
 *   "errorCode": 0,
 *   "errorMessage": "User Created Successfully"
 * }
 *
 * // Response (Failure - User Already Exists):
 * {
 *   "errorCode": 409,
 *   "errorMessage": "User already exists"
 * }
 *
 * // Response (Failure - Role Does Not Exist):
 * {
 *   "errorCode": 409,
 *   "errorMessage": "Role does not exist"
 * }
 *
 * Route: PATCH /
 *
 * Updates an existing user.
 *
 * @function
 * @name updateUser
 * @memberof module:userRoute
 * @inner
 * @param {Object} req - Express request object, which includes `userId` and `password` fields for updating the user data.
 * @param {Object} res - Express response object containing the status of user update.
 * @description This route allows you to update an existing user’s password. If the user does not exist, it returns an error message.
 *
 * @example
 * // Request:
 * PATCH /user
 * // Body:
 * {
 *   "userId": "existingUser123",
 *   "password": "newpassword123"
 * }
 *
 * // Response (Success):
 * {
 *   "errorCode": 0,
 *   "errorMessage": "User Updated Successfully"
 * }
 *
 * // Response (Failure - User Not Found):
 * {
 *   "errorCode": 404,
 *   "errorMessage": "User does not exist"
 * }
 *
 * Route: DELETE /
 *
 * Deletes an existing user.
 *
 * @function
 * @name deleteUser
 * @memberof module:userRoute
 * @inner
 * @param {Object} req - Express request object, which includes `userId` for the user to be deleted.
 * @param {Object} res - Express response object containing the status of user deletion.
 * @description This route allows you to delete a user by providing their `userId`. It marks the user’s status as 'D' (Deleted) in the database.
 *
 * @example
 * // Request:
 * DELETE /user
 * // Body:
 * {
 *   "userId": "existingUser123"
 * }
 *
 * // Response (Success):
 * {
 *   "errorCode": 0,
 *   "errorMessage": "User Deleted Successfully"
 * }
 *
 * // Response (Failure - User Not Found):
 * {
 *   "errorCode": 404,
 *   "errorMessage": "No user found"
 * }
 */




userRoute.route('/')
    .get(userController.getUsers)
    .post(userController.createUser)
    .patch(userController.updateUser)
    .delete(userController.deleteUser);

export default userRoute;    