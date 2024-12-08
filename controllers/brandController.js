import * as brandService from '../services/brandService.js';

/**
 * Creates a new brand in the system.
 * 
 * This function receives the brand's information (name in both English and Chinese) from the request body,
 * validates the input, and then calls the `brandService.createBrand` function to create a new brand.
 * If the required data is missing, or an error occurs during the creation process, the function returns 
 * an error message with a suitable status code.
 * 
 * @async
 * @function createBrand
 * @param {Object} req - The Express request object containing brand data.
 * @param {Object} req.body - The request body containing the brand data.
 * @param {string} req.body.brandNameZh - The brand name in Chinese (optional).
 * @param {string} req.body.brandNameEn - The brand name in English (required).
 * @param {Object} res - The Express response object used to send a response to the client.
 * @param {function} next - The next middleware function in the Express pipeline.
 * 
 * @returns {void} - Sends a response with a status code and message indicating brand creation.
 * 
 * @throws {Error} - If an error occurs, the error is passed to the next middleware.
 * 
 * @example
 * // Example usage of createBrand function
 * app.post('/brands', createBrand);
 */
export async function createBrand(req, res, next) {

    const brandNameZh = req.body.brandNameZh;
    const brandNameEn = req.body.brandNameEn;
    let response = {};

    if (!brandNameZh || !brandNameEn) {
        response.errorMessage = "Brand name is not provided";
        response.errorCode = 401;
        return next(response);
    }

    response = await brandService.createBrand(brandNameZh, brandNameEn);

    if (response.errorCode !== 0) {
        response.errorMessage = response.errorMessage || "Error Occurs";
        response.errorCode = response.errorCode || 500;
        return next(response);
    }

    res.status(201).json({ message:'Brand Created'});
}

/**
 * Updates an existing brand's information.
 * 
 * This function receives the brand's updated details (ID, name in both Chinese and English) from the request body,
 * validates the input, and calls `brandService.updateBrand` to update the brand information. 
 * If any required data is missing or an error occurs, an appropriate error message is sent back.
 * 
 * @async
 * @function updateBrand
 * @param {Object} req - The Express request object containing the updated brand data.
 * @param {Object} req.body - The request body containing updated brand information.
 * @param {string} req.body.id - The unique identifier of the brand to be updated (required).
 * @param {string} req.body.brandNameZh - The brand name in Chinese (optional).
 * @param {string} req.body.brandNameEn - The brand name in English (required).
 * @param {Object} res - The Express response object used to send a response to the client.
 * @param {function} next - The next middleware function in the Express pipeline.
 * 
 * @returns {void} - Sends a response with a status code and message indicating brand update success.
 * 
 * @throws {Error} - If an error occurs, the error is passed to the next middleware.
 * 
 * @example
 * // Example usage of updateBrand function
 * app.patch('/brands', updateBrand);
 */
export async function updateBrand(req, res, next) {

    const id = req.body.id;
    const brandNameZh = req.body.brandNameZh;
    const brandNameEn = req.body.brandNameEn;
    let response = {};

    if (!id || !brandNameZh || !brandNameEn) {
        response.errorMessage = "Please provide updated brand information";
        response.errorCode = 401;
        return next(response);
    }

    response = await brandService.updateBrand(id, brandNameZh, brandNameEn);

    if (response.errorCode !== 0) {
        response.errorMessage = response.errorMessage || "Error Occurs";
        response.errorCode = response.errorCode || 500;
        return next(response);
    }

    res.status(200).json({ message:'Brand updated'});
}

/**
 * Retrieves a list of brands, optionally filtered by brand ID.
 * 
 * This function fetches all brands or a specific brand based on the provided `id` query parameter.
 * If an error occurs during the process, an error message with the appropriate status code is returned.
 * 
 * @async
 * @function getBrands
 * @param {Object} req - The Express request object containing query parameters.
 * @param {Object} req.query - The query parameters to filter brands.
 * @param {string} req.query.id - Optional. The ID of a brand to retrieve (default is null for all brands).
 * @param {Object} res - The Express response object used to send the list of brands to the client.
 * @param {function} next - The next middleware function in the Express pipeline.
 * 
 * @returns {void} - Sends a response with a list of brands.
 * 
 * @throws {Error} - If an error occurs, the error is passed to the next middleware.
 * 
 * @example
 * // Example usage of getBrands function
 * app.get('/brands', getBrands);
 */
export async function getBrands(req, res, next) {

    let response = {};
    const id = req.query.id || null;
    response = await brandService.getBrands(id);

    if (response.errorCode !== 0) {
        response.errorMessage = response.errorMessage || "Error Occurs";
        response.errorCode = response.errorCode || 500;
        return next(response);
    }

    res.status(200).json({ brands:response.brands});
}

/**
 * Deletes an existing brand by its ID.
 * 
 * This function receives the brand's ID from the request body and calls `brandService.deleteBrand` 
 * to remove the brand from the database. If an error occurs during the deletion process, 
 * an error message is returned to the client.
 * 
 * @async
 * @function deleteBrand
 * @param {Object} req - The Express request object containing the brand ID to delete.
 * @param {Object} req.body - The request body containing the brand ID.
 * @param {string} req.body.id - The ID of the brand to be deleted (required).
 * @param {Object} res - The Express response object used to send a response to the client.
 * @param {function} next - The next middleware function in the Express pipeline.
 * 
 * @returns {void} - Sends a response confirming the brand deletion.
 * 
 * @throws {Error} - If an error occurs, the error is passed to the next middleware.
 * 
 * @example
 * // Example usage of deleteBrand function
 * app.delete('/brands', deleteBrand);
 */
export async function deleteBrand(req, res, next) {

    let response = {};
    const id = req.body.id;
    response = await brandService.deleteBrand(id);

    if (response.errorCode !== 0) {
        response.errorMessage = response.errorMessage || "Error Occurs";
        response.errorCode = response.errorCode || 500;
        return next(response);
    }

    res.status(200).json({ message: 'Brand Deleted'});
}

