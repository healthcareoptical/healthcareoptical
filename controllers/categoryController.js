import * as categoryService from '../services/categoryService.js';

/**
 * Creates a new category in the system.
 * 
 * This function receives category data (name in both Chinese and English) from the request body,
 * validates the input, and calls `categoryService.createCategory` to create the new category. 
 * If any required data is missing or an error occurs during creation, an error message is returned.
 * 
 * @async
 * @function createCategory
 * @param {Object} req - The Express request object containing category data.
 * @param {Object} req.body - The request body containing category data.
 * @param {string} req.body.categoryNameZh - The category name in Chinese (optional).
 * @param {string} req.body.categoryNameEn - The category name in English (required).
 * @param {Object} res - The Express response object used to send a response to the client.
 * @param {function} next - The next middleware function in the Express pipeline.
 * 
 * @returns {void} - Sends a response with a status code and message indicating category creation.
 * 
 * @throws {Error} - If an error occurs, the error is passed to the next middleware.
 * 
 * @example
 * // Example usage of createCategory function
 * app.post('/categories', createCategory);
 */
export async function createCategory(req, res, next) {

    const categoryNameZh = req.body.categoryNameZh;
    const categoryNameEn = req.body.categoryNameEn;
    let response = {};

    if (!categoryNameZh || !categoryNameEn) {
        response.errorMessage = "Category name is not provided";
        response.errorCode = 401;
        return next(response);
    }

    response = await categoryService.createCategory(categoryNameZh, categoryNameEn);

    if (response.errorCode !== 0) {
        response.errorMessage = response.errorMessage || "Error Occurs";
        response.errorCode = response.errorCode || 500;
        return next(response);
    }

    res.status(201).json({ message:'Category Created'});
}

/**
 * Updates an existing category's information.
 * 
 * This function receives the updated category's details (ID, name in both Chinese and English) from the request body,
 * validates the input, and calls `categoryService.updateCategory` to update the category.
 * If any required data is missing or an error occurs, an error message is returned.
 * 
 * @async
 * @function updateCategory
 * @param {Object} req - The Express request object containing updated category data.
 * @param {Object} req.body - The request body containing the updated category information.
 * @param {string} req.body.id - The unique identifier of the category to be updated (required).
 * @param {string} req.body.categoryNameZh - The category name in Chinese (optional).
 * @param {string} req.body.categoryNameEn - The category name in English (required).
 * @param {Object} res - The Express response object used to send a response to the client.
 * @param {function} next - The next middleware function in the Express pipeline.
 * 
 * @returns {void} - Sends a response with a status code and message indicating category update success.
 * 
 * @throws {Error} - If an error occurs, the error is passed to the next middleware.
 * 
 * @example
 * // Example usage of updateCategory function
 * app.patch('/categories', updateCategory);
 */
export async function updateCategory(req, res, next) {

    const id = req.body.id;
    const categoryNameZh = req.body.categoryNameZh;
    const categoryNameEn = req.body.categoryNameEn;
    let response = {};

    if (!id || !categoryNameZh || !categoryNameEn) {
        response.errorMessage = "Please provide updated category information";
        response.errorCode = 401;
        return next(response);
    }

    response = await categoryService.updateCategory(id, categoryNameZh, categoryNameEn);

    if (response.errorCode !== 0) {
        response.errorMessage = response.errorMessage || "Error Occurs";
        response.errorCode = response.errorCode || 500;
        return next(response);
    }

    res.status(200).json({ message:'Category updated'});
}

/**
 * Retrieves a list of categories, optionally filtered by category ID.
 * 
 * This function fetches all categories or a specific category based on the provided `id` query parameter.
 * If an error occurs during the process, an error message with the appropriate status code is returned.
 * 
 * @async
 * @function getCategories
 * @param {Object} req - The Express request object containing query parameters.
 * @param {Object} req.query - The query parameters to filter categories.
 * @param {string} req.query.id - Optional. The ID of a category to retrieve (default is null for all categories).
 * @param {Object} res - The Express response object used to send the list of categories to the client.
 * @param {function} next - The next middleware function in the Express pipeline.
 * 
 * @returns {void} - Sends a response with a list of categories.
 * 
 * @throws {Error} - If an error occurs, the error is passed to the next middleware.
 * 
 * @example
 * // Example usage of getCategories function
 * app.get('/categories', getCategories);
 */
export async function getCategories(req, res, next) {

    let response = {};
    const id = req.query.id || null;
    response = await categoryService.getCategories(id);

    if (response.errorCode !== 0) {
        response.errorMessage = response.errorMessage || "Error Occurs";
        response.errorCode = response.errorCode || 500;
        return next(response);
    }

    res.status(200).json({ categories:response.categories});
}

/**
 * Deletes an existing category by its ID.
 * 
 * This function receives the category's ID from the request body and calls `categoryService.deleteCategory` 
 * to remove the category from the database. If an error occurs during the deletion process, 
 * an error message is returned to the client.
 * 
 * @async
 * @function deleteCategory
 * @param {Object} req - The Express request object containing the category ID to delete.
 * @param {Object} req.body - The request body containing the category ID.
 * @param {string} req.body.id - The ID of the category to be deleted (required).
 * @param {Object} res - The Express response object used to send a response to the client.
 * @param {function} next - The next middleware function in the Express pipeline.
 * 
 * @returns {void} - Sends a response confirming the category deletion.
 * 
 * @throws {Error} - If an error occurs, the error is passed to the next middleware.
 * 
 * @example
 * // Example usage of deleteCategory function
 * app.delete('/categories', deleteCategory);
 */
export async function deleteCategory(req, res, next) {

    let response = {};
    const id = req.body.id;
    response = await categoryService.deleteCategory(id);

    if (response.errorCode !== 0) {
        response.errorMessage = response.errorMessage || "Error Occurs";
        response.errorCode = response.errorCode || 500;
        return next(response);
    }

    res.status(200).json({ message: 'Category Deleted'});
}

