import * as userService from '../services/userService.js';

/**
 * Creates a new user.
 * 
 * This function validates the user input, checks if the passwords match, and calls `userService.createUser` 
 * to create a new user. If any validation fails or an error occurs, an appropriate error message is returned.
 * Otherwise, a success message is sent.
 * 
 * @async
 * @function createUser
 * @param {Object} req - The Express request object containing the user's details (password, userId, roles).
 * @param {Object} res - The Express response object to send the response.
 * @param {function} next - The next middleware function to handle errors.
 * 
 * @returns {void} - Sends a response indicating whether the user was successfully created or not.
 * 
 * @throws {Error} - If an error occurs, the error is passed to the next middleware with a message and error code.
 * 
 * @example
 * // Example usage of createUser function
 * app.post('/users', createUser);
 */
export async function createUser(req, res, next) {

    const password = req.body.password;
    const reEntryPassword = req.body.reEntryPassword;
    const roleNames = req.body.roleNames || ['staff'];
    const userId = req.body.userId;
    let response = {};

    if (!password || !reEntryPassword || password !== reEntryPassword) {
        response.errorMessage = "Password does not match";
        response.errorCode = 401;
        return next(response);
    }

    if (!userId){
        response.errorMessage = "Please enter userId";
        response.errorCode = 401;
        return next(response);
    }

    response = await userService.createUser(userId, password, roleNames);

    if (response.errorCode !== 0) {
        response.errorMessage = response.errorMessage || "Error Occurs";
        response.errorCode = response.errorCode || 500;
        return next(response);
    }

    res.status(201).json({ message:'User Created'});
}

/**
 * Updates an existing user's details.
 * 
 * This function validates the user's input, checks if the passwords match, and calls `userService.updateUser` 
 * to update the user's details. If any validation fails or an error occurs, an appropriate error message is returned.
 * Otherwise, a success message is sent.
 * 
 * @async
 * @function updateUser
 * @param {Object} req - The Express request object containing the user's details (password, userId).
 * @param {Object} res - The Express response object to send the response.
 * @param {function} next - The next middleware function to handle errors.
 * 
 * @returns {void} - Sends a response indicating whether the user was successfully updated or not.
 * 
 * @throws {Error} - If an error occurs, the error is passed to the next middleware with a message and error code.
 * 
 * @example
 * // Example usage of updateUser function
 * app.put('/users', updateUser);
 */
export async function updateUser(req, res, next) {

    const password = req.body.password;
    const reEntryPassword = req.body.reEntryPassword;
    const userId = req.body.userId;
    let response = {};


    if (!password || !reEntryPassword || password !== reEntryPassword) {
        response.errorMessage = "Password does not match";
        response.errorCode = 401;
        return next(response);
    }

    if (!userId){
        response.errorMessage = "Please enter userId";
        response.errorCode = 401;
        return next(response);
    }

    response = await userService.updateUser(userId, password);

    if (response.errorCode !== 0) {
        response.errorMessage = response.errorMessage || "Error Occurs";
        response.errorCode = response.errorCode || 500;
        return next(response);
    }

    res.status(200).json({ message:'User updated'});
}

/**
 * Retrieves a list of users from the database.
 * 
 * This function calls `userService.getUsers` with the provided `userId` query parameter (optional) and returns 
 * a list of users matching the criteria. If an error occurs, it returns an appropriate error message.
 * 
 * @async
 * @function getUsers
 * @param {Object} req - The Express request object containing the `userId` query parameter (optional).
 * @param {Object} res - The Express response object to send the response.
 * @param {function} next - The next middleware function to handle errors.
 * 
 * @returns {void} - Sends a response containing the list of users or an error message.
 * 
 * @throws {Error} - If an error occurs, the error is passed to the next middleware with a message and error code.
 * 
 * @example
 * // Example usage of getUsers function
 * app.get('/users', getUsers);
 */
export async function getUsers(req, res, next) {

    let response = {};
    const userId = req.query.userId || null;
    response = await userService.getUsers(userId);

    if (response.errorCode !== 0) {
        response.errorMessage = response.errorMessage || "Error Occurs";
        response.errorCode = response.errorCode || 500;
        return next(response);
    }

    res.status(200).json({ users:response.users});
}

/**
 * Deletes a user from the database.
 * 
 * This function validates the input data (userId) and calls `userService.deleteUser` to delete the specified user.
 * If an error occurs, it returns an appropriate error message. Otherwise, it returns a success message.
 * 
 * @async
 * @function deleteUser
 * @param {Object} req - The Express request object containing the `userId` to be deleted.
 * @param {Object} res - The Express response object to send the response.
 * @param {function} next - The next middleware function to handle errors.
 * 
 * @returns {void} - Sends a response indicating whether the user was successfully deleted or not.
 * 
 * @throws {Error} - If an error occurs, the error is passed to the next middleware with a message and error code.
 * 
 * @example
 * // Example usage of deleteUser function
 * app.delete('/users', deleteUser);
 */
export async function deleteUser(req, res, next) {

    let response = {};
    const userId = req.body.userId;
    response = await userService.deleteUser(userId);

    if (response.errorCode !== 0) {
        response.errorMessage = response.errorMessage || "Error Occurs";
        response.errorCode = response.errorCode || 500;
        return next(response);
    }

    res.status(200).json({ message: 'User Deleted'});
}

