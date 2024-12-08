import { Brand } from '../models/brand.js';
import mongoose from 'mongoose';

/** 
 * Creates a new brand if it does not already exist.
 *
 * @async
 * @function createBrand
 * @param {string} brandNameZh - The Chinese name of the brand.
 * @param {string} brandNameEn - The English name of the brand.
 * @returns {Promise<Object>} A promise that resolves to an object containing the creation result:
 * - `errorCode` {number} - `0` if successful, `409` if the brand already exists, or `500` for other errors.
 * - `errorMessage` {string} - Descriptive error message or an empty string on success.
 *
 * @example
 * const result = await createBrand('品牌中文名', 'Brand Name');
 * if (result.errorCode === 0) {
 *     console.log('Brand created successfully.');
 * } else {
 *     console.error('Error:', result.errorMessage);
 * }
 */
export async function createBrand(brandNameZh, brandNameEn) {

    const createBrandReturn = {};
    const sess = await mongoose.startSession();
    sess.startTransaction();

    try {
        const duplicatedBrand = await Brand.findOne({ $and :[{ brandNameEn: { $regex: new RegExp(`^${brandNameEn}$`, 'i') } }, {status :'A'} ]});

        if (duplicatedBrand) {
            createBrandReturn.errorCode = 409;
            createBrandReturn.errorMessage = 'Brand already exists';
            return createBrandReturn;
        }

        await Brand.create([{
            brandNameEn: brandNameEn,
            brandNameZh: brandNameZh,
            status: 'A'
        }], { session: sess });
        
        createBrandReturn.errorCode = 0;
        createBrandReturn.errorMessage = '';
        await sess.commitTransaction();
    } catch {
        createBrandReturn.errorCode = 500;
        createBrandReturn.errorMessage = 'Error Occurs';
    }
    sess.endSession();
    return createBrandReturn;
}

/**
 * Updates an existing brand's details.
 *
 * @async
 * @function updateBrand
 * @param {string} id - The ID of the brand to update.
 * @param {string} brandNameZh - The updated Chinese name of the brand.
 * @param {string} brandNameEn - The updated English name of the brand.
 * @returns {Promise<Object>} A promise that resolves to an object containing the update result:
 * - `errorCode` {number} - `0` if successful, `404` if the brand does not exist, or `500` for other errors.
 * - `errorMessage` {string} - Descriptive error message or an empty string on success.
 *
 * @example
 * const result = await updateBrand('12345', '新品牌中文名', 'Updated Brand Name');
 * if (result.errorCode === 0) {
 *     console.log('Brand updated successfully.');
 * } else {
 *     console.error('Error:', result.errorMessage);
 * }
 */
export async function updateBrand(id, brandNameZh, brandNameEn) {

    const updateBrandReturn = {};
    const sess = await mongoose.startSession();
    sess.startTransaction();

    try {
        const brand = await Brand.findById(id);

        if (!brand || brand.status !== 'A') {
            updateBrandReturn.errorCode = 404;
            updateBrandReturn.errorMessage = 'Brand does not exists';
            return updateBrandReturn;
        }

        brand.brandNameZh = brandNameZh;
        brand.brandNameEn = brandNameEn;
        await brand.save({ session: sess });
        await sess.commitTransaction();
        updateBrandReturn.errorCode = 0;
        updateBrandReturn.errorMessage = "";
    } catch {
        updateBrandReturn.errorCode = 500;
        updateBrandReturn.errorMessage = 'Error Occurs';
    }
    sess.endSession();
    return updateBrandReturn;
}

/**
 * Retrieves brand(s) from the database.
 *
 * @async
 * @function getBrands
 * @param {string} [id] - The ID of a specific brand to retrieve. If not provided, all active brands are returned.
 * @returns {Promise<Object>} A promise that resolves to an object containing the retrieval result:
 * - `errorCode` {number} - `0` if successful, `404` if no brands are found, or `500` for other errors.
 * - `errorMessage` {string} - Descriptive error message or an empty string on success.
 * - `brands` {Array<Object>} - An array of brand objects or a single brand object if `id` is provided.
 *
 * @example
 * const result = await getBrands();
 * if (result.errorCode === 0) {
 *     console.log('Brands retrieved:', result.brands);
 * } else {
 *     console.error('Error:', result.errorMessage);
 * }
 */
export async function getBrands(id) {
    const getBrandsReturn = {};

    try {
        if (id) {
            const brand = await Brand.findById(id);
            if (!brand) {
                getBrandsReturn.errorCode = 404;
                getBrandsReturn.errorMessage = 'No brand found';
                return getBrandsReturn;
            }
            getBrandsReturn.brands = [brand];
        } else {
            const brands = await Brand.find({status :'A'});

            if (!brands || brands.length == 0) {
                getBrandsReturn.errorCode = 404;
                getBrandsReturn.errorMessage = 'No brand found';
                return getBrandsReturn;
            }
            
            getBrandsReturn.brands = brands;
        }
        getBrandsReturn.errorCode = 0;
        getBrandsReturn.errorMessage = "";
    } catch {
        getBrandsReturn.errorCode = 500;
        getBrandsReturn.errorMessage = 'Error Occurs';
    }
    return getBrandsReturn;
}

/**
 * Marks a brand as deleted by changing its status to 'D'.
 *
 * @async
 * @function deleteBrand
 * @param {string} id - The ID of the brand to delete.
 * @returns {Promise<Object>} A promise that resolves to an object containing the deletion result:
 * - `errorCode` {number} - `0` if successful, `404` if the brand does not exist, or `500` for other errors.
 * - `errorMessage` {string} - Descriptive error message or an empty string on success.
 *
 * @example
 * const result = await deleteBrand('12345');
 * if (result.errorCode === 0) {
 *     console.log('Brand deleted successfully.');
 * } else {
 *     console.error('Error:', result.errorMessage);
 * }
 */
export async function deleteBrand(id) {

    const deleteBrandReturn = {};
    const sess = await mongoose.startSession();
    sess.startTransaction();

    try {
        const brand = await Brand.findById(id);

        if (!brand || brand.status !== 'A') {
            deleteBrandReturn.errorCode = 404;
            deleteBrandReturn.errorMessage = 'No brand found';
            return deleteBrandReturn;
        }

        brand.status = 'D';
        await brand.save({ session: sess });
        await sess.commitTransaction();
        deleteBrandReturn.errorCode = 0;
        deleteBrandReturn.errorMessage = "";
    } catch {
        deleteBrandReturn.errorCode = 500;
        deleteBrandReturn.errorMessage = 'Error Occurs';
    }
    return deleteBrandReturn;
}