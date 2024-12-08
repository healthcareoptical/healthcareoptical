import { Router } from "express";
import * as productConrtoller from '../controllers/productController.js';
import { upload } from "../middlewares/uploadFile.js";

const productRoute = Router();

/**
 * Route: POST /
 *
 * Creates a new product.
 *
 * @function
 * @name createProduct
 * @memberof module:productRoute
 * @inner
 * @param {Object} req - Express request object, which includes the file uploaded in `file` field and product data.
 * @param {Object} res - Express response object containing the status of product creation.
 * @description This route allows you to create a new product by sending the product data and an optional file (e.g., image) through a multipart form. The uploaded file is handled by the `upload.single('file')` middleware.
 *
 * @example
 * // Request:
 * POST /product
 * // Form data includes:
 * {
 *   "name": "Product Name",
 *   "price": 99.99,
 *   "category": "Category",
 *   "file": <File (image)>
 * }
 *
 * // Response (Success):
 * {
 *   "errorCode": 0,
 *   "errorMessage": "Product Created Successfully"
 * }
 *
 * // Response (Failure - Internal Server Error):
 * {
 *   "errorCode": 500,
 *   "errorMessage": "Error Occurs"
 * }
 *
 * Route: PATCH /
 *
 * Updates an existing product.
 *
 * @function
 * @name updateProduct
 * @memberof module:productRoute
 * @inner
 * @param {Object} req - Express request object, which includes the file uploaded in `file` field (optional) and updated product data.
 * @param {Object} res - Express response object containing the status of product update.
 * @description This route allows you to update an existing product by sending updated data and an optional file through a multipart form. The uploaded file is handled by the `upload.single('file')` middleware.
 *
 * @example
 * // Request:
 * PATCH /product
 * // Form data includes:
 * {
 *   "productId": "123",
 *   "name": "Updated Product Name",
 *   "price": 109.99,
 *   "file": <File (image)>  // Optional
 * }
 *
 * // Response (Success):
 * {
 *   "errorCode": 0,
 *   "errorMessage": "Product Updated Successfully"
 * }
 *
 * // Response (Failure - Product Not Found):
 * {
 *   "errorCode": 404,
 *   "errorMessage": "Product Not Found"
 * }
 *
 * Route: GET /
 *
 * Fetches a list of products.
 *
 * @function
 * @name getProducts
 * @memberof module:productRoute
 * @inner
 * @param {Object} req - Express request object, which may include query parameters for filtering.
 * @param {Object} res - Express response object containing the list of products.
 * @description This route fetches products, optionally filtered by query parameters (e.g., by category, price range). Returns a list of products with their data.
 *
 * @example
 * // Request:
 * GET /product?category=Electronics&priceMin=50
 *
 * // Response (Success):
 * {
 *   "errorCode": 0,
 *   "errorMessage": "",
 *   "products": [
 *     { "id": "123", "name": "Product 1", "price": 99.99 },
 *     { "id": "124", "name": "Product 2", "price": 79.99 }
 *   ]
 * }
 *
 * // Response (Failure - No Products Found):
 * {
 *   "errorCode": 404,
 *   "errorMessage": "No Products Found"
 * }
 /**
 * Route: DELETE /
 *
 * Deletes an existing product.
 *
 * @function
 * @name deleteProduct
 * @memberof module:productRoute
 * @inner
 * @param {Object} req - Express request object, which includes product identifier for the product to be deleted.
 * @param {Object} res - Express response object containing the status of product deletion.
 * @description This route allows you to delete an existing product by providing the product identifier in the request body.
 *
 * @example
 * // Request:
 * DELETE /product
 * // Body:
 * {
 *   "productId": "123"
 * }
 *
 * // Response (Success):
 * {
 *   "errorCode": 0,
 *   "errorMessage": "Product Deleted Successfully"
 * }
 *
 * // Response (Failure - Product Not Found):
 * {
 *   "errorCode": 404,
 *   "errorMessage": "Product Not Found"
 * }
 */

productRoute.route('/')
    .post(upload.single('file'), productConrtoller.createProduct)
    .patch(upload.single('file'), productConrtoller.updateProduct)
    .get(productConrtoller.getProducts)
    .delete(productConrtoller.deleteProduct);

export default productRoute;    
