import { Router } from "express";
import * as categoryController from '../controllers/categoryController.js';

const categoryRoute = Router();

/**
 * Route: GET /
 *
 * Retrieves category information.
 *
 * @function
 * @name getCategories
 * @memberof module:categoryRoute
 * @inner
 * @param {Object} req - Express request object. May include a query parameter for a specific category ID.
 * @param {Object} res - Express response object that sends category details.
 * @description Calls the `getCategories` function from `categoryController` to fetch a list of active categories or a specific category by ID.
 *
 * @example
 * // Request (Retrieve all categories):
 * GET /
 *
 * // Request (Retrieve specific category):
 * GET /?id=123
 *
 * // Response:
 * {
 *   "errorCode": 0,
 *   "categories": [
 *     { "id": "123", "categoryNameEn": "Category A", "categoryNameZh": "类别A", "status": "A" }
 *   ]
 * }
 *
 * Route: POST /
 *
 * Creates a new category.
 *
 * @function
 * @name createCategory
 * @memberof module:categoryRoute
 * @inner
 * @param {Object} req - Express request object containing category details in the request body.
 * @param {Object} res - Express response object that confirms category creation.
 * @description Calls the `createCategory` function from `categoryController` to create a new category.
 *
 * @example
 * // Request Body:
 * {
 *   "categoryNameEn": "Category A",
 *   "categoryNameZh": "类别A"
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
 *   "errorMessage": "Category already exists"
 * }
 *
 * Route: PATCH /
 *
 * Updates an existing category.
 *
 * @function
 * @name updateCategory
 * @memberof module:categoryRoute
 * @inner
 * @param {Object} req - Express request object containing category ID and updated details in the request body.
 * @param {Object} res - Express response object that confirms the update result.
 * @description Calls the `updateCategory` function from `categoryController` to update a category's information.
 *
 * @example
 * // Request Body:
 * {
 *   "id": "123",
 *   "categoryNameEn": "Updated Category A",
 *   "categoryNameZh": "更新类别A"
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
 * Deletes an existing category.
 *
 * @function
 * @name deleteCategory
 * @memberof module:categoryRoute
 * @inner
 * @param {Object} req - Express request object containing the category ID in the request body.
 * @param {Object} res - Express response object that confirms category deletion.
 * @description Calls the `deleteCategory` function from `categoryController` to mark a category as inactive.
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
categoryRoute.route('/')
    .get(categoryController.getCategories)
    .post(categoryController.createCategory)
    .patch(categoryController.updateCategory)
    .delete(categoryController.deleteCategory);

export default categoryRoute;    