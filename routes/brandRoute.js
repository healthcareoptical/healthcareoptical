import { Router } from "express";
import * as brandConrtoller from '../controllers/brandController.js';

const brandRoute = Router();

/**
 * Route: GET /
 *
 * Retrieves brand information.
 *
 * @function
 * @name getBrands
 * @memberof module:brandRoute
 * @inner
 * @param {Object} req - Express request object. May include a query parameter for a specific brand ID.
 * @param {Object} res - Express response object that sends brand details.
 * @description Calls the `getBrands` function from `brandController` to fetch a list of active brands or a specific brand by ID.
 *
 * @example
 * // Request (Retrieve all brands):
 * GET /
 *
 * // Request (Retrieve specific brand):
 * GET /?id=123
 *
 * // Response:
 * {
 *   "errorCode": 0,
 *   "brands": [
 *     { "id": "123", "brandNameEn": "Brand A", "brandNameZh": "品牌A", "status": "A" }
 *   ]
 * }
 * 
 * Route: POST /
 *
 * Creates a new brand.
 *
 * @function
 * @name createBrand
 * @memberof module:brandRoute
 * @inner
 * @param {Object} req - Express request object containing brand details in the request body.
 * @param {Object} res - Express response object that confirms brand creation.
 * @description Calls the `createBrand` function from `brandController` to create a new brand.
 *
 * @example
 * // Request Body:
 * {
 *   "brandNameEn": "Brand A",
 *   "brandNameZh": "品牌A"
 * }
 *
 * // Response (Success):
 * {
 *   "errorCode": 0,
 *   "errorMessage": ""
 * }
 *
 * // Response (Failure):
 * {
 *   "errorCode": 409,
 *   "errorMessage": "Brand already exists"
 * }
 *
 * Route: PATCH /
 *
 * Updates an existing brand.
 *
 * @function
 * @name updateBrand
 * @memberof module:brandRoute
 * @inner
 * @param {Object} req - Express request object containing brand ID and updated details in the request body.
 * @param {Object} res - Express response object that confirms the update result.
 * @description Calls the `updateBrand` function from `brandController` to update a brand's information.
 *
 * @example
 * // Request Body:
 * {
 *   "id": "123",
 *   "brandNameEn": "Updated Brand A",
 *   "brandNameZh": "更新品牌A"
 * }
 *
 * // Response:
 * {
 *   "errorCode": 0,
 *   "errorMessage": ""
 * }
 *
 * Route: DELETE /
 *
 * Deletes an existing brand.
 *
 * @function
 * @name deleteBrand
 * @memberof module:brandRoute
 * @inner
 * @param {Object} req - Express request object containing the brand ID in the request body.
 * @param {Object} res - Express response object that confirms brand deletion.
 * @description Calls the `deleteBrand` function from `brandController` to mark a brand as inactive.
 *
 * @example
 * // Request Body:
 * {
 *   "id": "123"
 * }
 *
 * // Response:
 * {
 *   "errorCode": 0,
 *   "errorMessage": ""
 * }
 */
brandRoute.route('/')
    .get(brandConrtoller.getBrands)
    .post(brandConrtoller.createBrand)
    .patch(brandConrtoller.updateBrand)
    .delete(brandConrtoller.deleteBrand);

export default brandRoute;    