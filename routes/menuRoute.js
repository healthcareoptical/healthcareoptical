import { Router } from "express";
import * as menuController from '../controllers/menuController.js';

const menuRoute = Router();

/**
 * Route: GET /
 *
 * Fetches menu selections and categorizes them by brands and categories.
 *
 * @function
 * @name getSelections
 * @memberof module:menuRoute
 * @inner
 * @param {Object} req - Express request object to initiate the menu selection request.
 * @param {Object} res - Express response object containing the menu data or error message.
 * @description Calls the `getSelections` function from `menuController` to retrieve the menu selections. It returns data categorized by brand and category with the count of products for each brand.
 *
 * @example
 * // Request:
 * GET /menu
 *
 * // Response (Success):
 * {
 *   "errorCode": 0,
 *   "errorMessage": "",
 *   "menu": [
 *     {
 *       "category": { Category Data },
 *       "count": 5,
 *       "brands": [
 *         { "brand": { Brand Data  }, "count": 2 },
 *         { "brand": {  Brand Data }, "count": 3 }
 *       ]
 *     },
 *     {  Another Category Data  }
 *   ]
 * }
 *
 * // Response (Failure - No Categories Found):
 * {
 *   "errorCode": 404,
 *   "errorMessage": "No Data Found"
 * }
 *
 * // Response (Failure - Internal Server Error):
 * {
 *   "errorCode": 500,
 *   "errorMessage": "Error Occurs"
 * }
 */

menuRoute.route('/')
    .get(menuController.getSelections);

export default menuRoute;    