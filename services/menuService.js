import { Product } from '../models/product.js';
import { Category } from '../models/category.js';
import mongoose from 'mongoose';

/** 
 * Retrieves a structured menu selection containing categories, their product counts, and associated brands.
 * 
 * This function fetches active categories and their corresponding active products from the database.
 * For each category, it groups products by their associated brands, calculating the count of products per brand.
 * 
 * @async
 * @function getSelections
 * @returns {Promise<Object>} A promise that resolves to an object with the menu data or error information:
 * - If successful:
 *   - `menu` {Array<Object>} - A list of categories with their product counts and associated brands.
 *     - Each category object contains:
 *       - `category` {Object} - The category object.
 *       - `count` {number} - The total count of products in this category.
 *       - `brands` {Array<Object>} - A list of brand objects with product counts.
 *         - Each brand object contains:
 *           - `brand` {Object} - The brand object.
 *           - `count` {number} - The count of products for this brand.
 *   - `errorCode` {number} - A code indicating the success (0) or type of error (404 or 500).
 *   - `errorMessage` {string} - A descriptive message about the result or the error.
 * 
 * - If an error occurs:
 *   - `errorCode` will be `500` and `errorMessage` will contain the error description.
 * 
 * @throws {Error} If an unexpected error occurs during execution.
 * 
 * @example
 * const selections = await getSelections();
 * if (selections.errorCode === 0) {
 *     console.log('Menu:', selections.menu);
 * } else {
 *     console.error('Error:', selections.errorMessage);
 * }
 */

export async function getSelections() {
    const getSelectionReturn = {};
    const sess = await mongoose.startSession();
    sess.startTransaction();
    try {
        let menu = [];
        const categories = await Category.find({status : 'A'});

        if (!categories || categories.length === 0){
            getSelectionReturn.errorCode = 404;
            getSelectionReturn.errorMessage = "No Data Found";
        }

        for (const category of categories) {
            let menuItem = {
                category,
                count :0,
                brands: []
            }
            const categoryProducts = await Product.find({ category: { $eq: category }, status: 'A' }).populate('brand');
            if (categoryProducts && categoryProducts.length > 0){
                const result = categoryProducts.reduce((acc, item) => {
                    const existing = acc.find(obj => obj.brand === item.brand);
                    if (existing) {
                        existing.count += 1; 
                    } else {
                        acc.push({ brand: item.brand, count: 1 }); 
                    }
                    return acc;
                }, []);
                menuItem.brands = result;
                menuItem.count = categoryProducts.length;
            }
            menu.push(menuItem)
        }
        
        if (!menu || menu.length ===0){
            getSelectionReturn.errorCode = 404;
            getSelectionReturn.errorMessage = "No Data Found";
        }
        getSelectionReturn.menu = menu;
        getSelectionReturn.errorCode = 0;
        getSelectionReturn.errorMessage = "";
    } catch {
        getSelectionReturn.errorCode = 500;
        getSelectionReturn.errorMessage = 'Error Occurs';
    }
    sess.endSession();
    return getSelectionReturn;
}
