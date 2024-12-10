import * as menuService from '../services/menuService.js';

/**
 * Retrieves the available menu selections.
 * 
 * This function calls `menuService.getSelections` to fetch all available menu selections.
 * If an error occurs during the process, it returns an error message to the client. 
 * If successful, it returns the menu selections.
 * 
 * @async
 * @function getSelections
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object used to send a response back to the client.
 * @param {function} next - The next middleware function to handle any errors.
 * 
 * @returns {void} - Sends a response containing the menu selections.
 * 
 * @throws {Error} - If an error occurs, the error is passed to the next middleware with a message and error code.
 * 
 * @example
 * // Example usage of getSelections function
 * app.get('/menu', getSelections);
 */
export async function getSelections(req, res, next) {

    let response = {};
    response = await menuService.getSelections();

    if (response.errorCode !== 0) {
        response.errorMessage = response.errorMessage || "Error Occurs";
        response.errorCode = response.errorCode || 500;
        return next(response);
    }

    res.status(200).json({ menu: response.menu});
}
