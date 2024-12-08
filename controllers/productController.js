import * as productService from '../services/productService.js';

/**
 * Creates a new product in the database.
 * 
 * This function validates the input data, including file (image), product details (price, model number, description, etc.),
 * and calls `productService.createProduct` to create the product. If validation fails or an error occurs, it returns
 * an appropriate error message. Otherwise, it returns a success message.
 * 
 * @async
 * @function createProduct
 * @param {Object} req - The Express request object containing the product details.
 * @param {Object} res - The Express response object to send the response.
 * @param {function} next - The next middleware function to handle errors.
 * 
 * @returns {void} - Sends a response indicating whether the product was successfully created or not.
 * 
 * @throws {Error} - If an error occurs, the error is passed to the next middleware with a message and error code.
 * 
 * @example
 * // Example usage of createProduct function
 * app.post('/products', createProduct);
 */
export async function createProduct(req, res, next) {

    const file = req.file || null;
    const price = req.body.price;
    const modelNo = req.body.modelNo;
    const discountPrice = req.body.discountPrice;
    const prodDescEn = req.body.prodDescEn;
    const prodDescZh = req.body.prodDescZh;
    const prodNameEn = req.body.prodNameEn;
    const prodNameZh = req.body.prodNameZh;
    const categoryId = req.body.categoryId;
    const brandId = req.body.brandId;

    let response = {};

    if (!file){
        response.errorMessage = "Image is not provided";
        response.errorCode = 401;
        return next(response);
    }

    if (!modelNo){
        response.errorMessage = "Model No is not provided";
        response.errorCode = 401;
        return next(response);
    }

    if (!price) {
        response.errorMessage = "Price is not provided";
        response.errorCode = 401;
        return next(response);
    }

    if (!prodDescEn || !prodDescZh){
        response.errorMessage = "Product description is not provided";
        response.errorCode = 401;
        return next(response);
    }

    if (!prodNameEn || !prodNameZh){
        response.errorMessage = "Product name is not provided";
        response.errorCode = 401;
        return next(response);
    }

    if (!categoryId){
        response.errorMessage = "Product category is not provided";
        response.errorCode = 401;
        return next(response);
    }

    if (!brandId){
        response.errorMessage = "Product brand is not provided";
        response.errorCode = 401;
        return next(response);
    }

    if (price < discountPrice) {
        response.errorMessage = "Price is smaller than discount price";
        response.errorCode = 401;
        return next(response);
    }

    response = await productService.createProduct(file, modelNo, price, discountPrice, prodDescEn, prodDescZh, prodNameEn, prodNameZh, categoryId, brandId);

    if (response.errorCode !== 0) {
        response.errorMessage = response.errorMessage || "Error Occurs";
        response.errorCode = response.errorCode || 500;
        return next(response);
    }

    res.status(201).json({ message:'Product Created'});
}

/**
 * Updates an existing product in the database.
 * 
 * This function validates the input data, including file (image), product details (price, model number, description, etc.),
 * and calls `productService.updateProduct` to update the product details. If validation fails or an error occurs, it returns
 * an appropriate error message. Otherwise, it returns a success message.
 * 
 * @async
 * @function updateProduct
 * @param {Object} req - The Express request object containing the product details.
 * @param {Object} res - The Express response object to send the response.
 * @param {function} next - The next middleware function to handle errors.
 * 
 * @returns {void} - Sends a response indicating whether the product was successfully updated or not.
 * 
 * @throws {Error} - If an error occurs, the error is passed to the next middleware with a message and error code.
 * 
 * @example
 * // Example usage of updateProduct function
 * app.put('/products', updateProduct);
 */
export async function updateProduct(req, res, next) {

    const file = req.file || null;
    const id = req.body.id;
    const price = req.body.price;
    const modelNo = req.body.modelNo;
    const discountPrice = req.body.discountPrice;
    const prodDescEn = req.body.prodDescEn;
    const prodDescZh = req.body.prodDescZh;
    const prodNameEn = req.body.prodNameEn;
    const prodNameZh = req.body.prodNameZh;
    const categoryId = req.body.categoryId;
    const brandId = req.body.brandId;

    let response = {};

    if (!id){
        response.errorMessage = "Product Id is not provided";
        response.errorCode = 401;
        return next(response);
    }

    if (!modelNo) {
        response.errorMessage = "Model No is not provided";
        response.errorCode = 401;
        return next(response);
    }

    if (!price) {
        response.errorMessage = "Price is not provided";
        response.errorCode = 401;
        return next(response);
    }

    if (!prodDescEn || !prodDescZh){
        response.errorMessage = "Product description is not provided";
        response.errorCode = 401;
        return next(response);
    }

    if (!prodNameEn || !prodNameZh){
        response.errorMessage = "Product name is not provided";
        response.errorCode = 401;
        return next(response);
    }

    if (!categoryId){
        response.errorMessage = "Product category is not provided";
        response.errorCode = 401;
        return next(response);
    }

    if (!brandId){
        response.errorMessage = "Product brand is not provided";
        response.errorCode = 401;
        return next(response);
    }

    if (price < discountPrice) {
        response.errorMessage = "Price is smaller than discount price";
        response.errorCode = 401;
        return next(response);
    }

    response = await productService.updateProduct(id, modelNo, file, price, discountPrice, prodDescEn, prodDescZh, prodNameEn, prodNameZh, categoryId, brandId);

    if (response.errorCode !== 0) {
        response.errorMessage = response.errorMessage || "Error Occurs";
        response.errorCode = response.errorCode || 500;
        return next(response);
    }

    res.status(201).json({ message:'Product Updatded'});
}

/**
 * Retrieves a list of products from the database based on query parameters.
 * 
 * This function calls `productService.getProducts` with the provided query parameters (product ID, category ID, brand ID, etc.)
 * and returns a list of products matching the criteria. If an error occurs, it returns an appropriate error message.
 * 
 * @async
 * @function getProducts
 * @param {Object} req - The Express request object containing query parameters.
 * @param {Object} res - The Express response object to send the response.
 * @param {function} next - The next middleware function to handle errors.
 * 
 * @returns {void} - Sends a response containing the list of products or an error message.
 * 
 * @throws {Error} - If an error occurs, the error is passed to the next middleware with a message and error code.
 * 
 * @example
 * // Example usage of getProducts function
 * app.get('/products', getProducts);
 */
export async function getProducts(req, res, next) {

    let response = {};
    const id = req.query.id;
    const categoryId = req.query.categoryId;
    const brandId = req.query.brandId;
    const orderBy = req.query.orderBy;
    const order = req.query.order;
    
    response = await productService.getProducts(id, categoryId, brandId, orderBy, order );

    if (response.errorCode !== 0) {
        response.errorMessage = response.errorMessage || "Error Occurs";
        response.errorCode = response.errorCode || 500;
        return next(response);
    }

    res.status(200).json({ products:response.products});
}

/**
 * Deletes a product from the database.
 * 
 * This function validates the input data and calls `productService.deleteProduct` to delete the specified product by ID.
 * If an error occurs, it returns an appropriate error message. Otherwise, it returns a success message.
 * 
 * @async
 * @function deleteProduct
 * @param {Object} req - The Express request object containing the product ID to be deleted.
 * @param {Object} res - The Express response object to send the response.
 * @param {function} next - The next middleware function to handle errors.
 * 
 * @returns {void} - Sends a response indicating whether the product was successfully deleted or not.
 * 
 * @throws {Error} - If an error occurs, the error is passed to the next middleware with a message and error code.
 * 
 * @example
 * // Example usage of deleteProduct function
 * app.delete('/products', deleteProduct);
 */
export async function deleteProduct(req, res, next) {

    let response = {};
    const id = req.body.id;
    response = await productService.deleteProduct(id);

    if (response.errorCode !== 0) {
        response.errorMessage = response.errorMessage || "Error Occurs";
        response.errorCode = response.errorCode || 500;
        return next(response);
    }

    res.status(200).json({ message: 'Product Deleted'});
}

