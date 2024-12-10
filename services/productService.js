import { Product } from '../models/product.js';
import { Brand } from '../models/brand.js';
import { Category } from '../models/category.js';
import mongoose from 'mongoose';
import { uploadImage } from '../middlewares/uploadFile.js';


/**
 * Creates a new category if it does not already exist.
 *
 * @async
 * @function createCategory
 * @param {string} categoryNameZh - The Chinese name of the category.
 * @param {string} categoryNameEn - The English name of the category.
 * @returns {Promise<Object>} A promise that resolves to an object containing the creation result:
 * - `errorCode` {number} - `0` if successful, `409` if the category already exists, or `500` for other errors.
 * - `errorMessage` {string} - Descriptive error message or an empty string on success.
 *
 * @example
 * const result = await createCategory('类别中文名', 'Category Name');
 * if (result.errorCode === 0) {
 *     console.log('Category created successfully.');
 * } else {
 *     console.error('Error:', result.errorMessage);
 * }
 */
export async function createProduct(file, modelNo, price, discountPrice, prodDescEn, prodDescZh, prodNameEn, prodNameZh, categoryId, brandId) {

    const createProductReturn = {};
    console.log('start to get session');
    const sess = await mongoose.startSession();
    console.log('Finish to get session');
    sess.startTransaction();
    console.log('Finish to get transaction');

    try {
        //check if product exist
        const duplicatedProduct = await Product.findOne({ $and :[{ modelNo: modelNo }, {status :'A'} ]});
        console.log('Finish to check duplicate product');
        
        if (duplicatedProduct) {
            createProductReturn.errorCode = 409;
            createProductReturn.errorMessage = 'Product already exists';
            return createProductReturn;
        }

        //check if category exists
        const categoryFound = await Category.findById(categoryId);
        console.log('Finish to check category');

        if (!categoryFound || categoryFound.status !== 'A'){
            createProductReturn.errorCode = 409;
            createProductReturn.errorMessage = 'Category does not exist';
            return createProductReturn;
        }

        //check if brand exists
        const brandFound = await Brand.findById(brandId);
        console.log('Finish to check brand');

        if (!brandFound || brandFound.status !== 'A'){
            createProductReturn.errorCode = 409;
            createProductReturn.errorMessage = 'Brand does not exist';
            return createProductReturn;
        }

        //upload image
        let imageUrl;
        if (file){
            const blob = await uploadImage(file);
            imageUrl = blob?.downloadUrl;
        }
        console.log('Finish to upload image');

        //create product if not exist
        await Product.create([{
            modelNo: modelNo,
            price: price,
            discountPrice: discountPrice,
            prodDescEn: prodDescEn,
            prodDescZh: prodDescZh,
            prodNameEn: prodNameEn,
            prodNameZh: prodNameZh,
            imageUrl: imageUrl,
            category: categoryFound,
            brand: brandFound,
            status: 'A',
            releaseDate: new Date()
        }], { session: sess });
        console.log('Finish to create product');
        
        createProductReturn.errorCode = 0;
        createProductReturn.errorMessage = '';
        await sess.commitTransaction();
        console.log('Finish to commit session');
    } catch {
        createProductReturn.errorCode = 500;
        createProductReturn.errorMessage = 'Error Occurs';
    }
    sess.endSession();
    console.log('Finish to end session');
    return createProductReturn;
}

/**
 * Updates an existing category's details.
 *
 * @async
 * @function updateCategory
 * @param {string} id - The ID of the category to update.
 * @param {string} categoryNameZh - The updated Chinese name of the category.
 * @param {string} categoryNameEn - The updated English name of the category.
 * @returns {Promise<Object>} A promise that resolves to an object containing the update result:
 * - `errorCode` {number} - `0` if successful, `404` if the category does not exist, or `500` for other errors.
 * - `errorMessage` {string} - Descriptive error message or an empty string on success.
 *
 * @example
 * const result = await updateCategory('12345', '新类别中文名', 'Updated Category Name');
 * if (result.errorCode === 0) {
 *     console.log('Category updated successfully.');
 * } else {
 *     console.error('Error:', result.errorMessage);
 * }
 */
export async function updateProduct(id, modelNo, file, price, discountPrice, prodDescEn, prodDescZh, prodNameEn, prodNameZh, categoryId, brandId) {

    const updateProductReturn = {};
    const sess = await mongoose.startSession();
    sess.startTransaction();

    try {
        //check if product exist
        const product = await Product.findById(id);

        if (!product || product.status !== 'A') {
            updateProductReturn.errorCode = 404;
            updateProductReturn.errorMessage = 'Product does not exist';
            return updateProductReturn;
        }

        //check if category exists
        const categoryFound = await Category.findById(categoryId);

        if (!categoryFound || categoryFound.status !== 'A'){
            updateProductReturn.errorCode = 409;
            updateProductReturn.errorMessage = 'Category does not exist';
            return updateProductReturn;
        }

        //check if brand exists
        const brandFound = await Brand.findById(brandId);

        if (!brandFound || brandFound.status !== 'A'){
            updateProductReturn.errorCode = 409;
            updateProductReturn.errorMessage = 'Brand does not exist';
            return updateProductReturn;
        }

        //upload image
        if (file){
            const blob = await uploadImage(file);
            product.imageUrl = blob?.downloadUrl;
        }

        //save modified product
        product.price = price;
        product.modelNo = modelNo;
        product.discountPrice = discountPrice;
        product.prodDescEn = prodDescEn;
        product.prodDescZh = prodDescZh;
        product.prodNameEn = prodNameEn;
        product.prodNameZh = prodNameZh;
        product.brand = brandFound;
        product.category = categoryFound;
        await product.save({ session: sess });
        await sess.commitTransaction();
        updateProductReturn.errorCode = 0;
        updateProductReturn.errorMessage = "";
    } catch {
        updateProductReturn.errorCode = 500;
        updateProductReturn.errorMessage = 'Error Occurs';
    }
    sess.endSession();
    return updateProductReturn;
}

/**
 * Retrieves category(s) from the database.
 *
 * @async
 * @function getCategories
 * @param {string} [id] - The ID of a specific category to retrieve. If not provided, all active categories are returned.
 * @returns {Promise<Object>} A promise that resolves to an object containing the retrieval result:
 * - `errorCode` {number} - `0` if successful, `404` if no categories are found, or `500` for other errors.
 * - `errorMessage` {string} - Descriptive error message or an empty string on success.
 * - `categories` {Array<Object>} - An array of category objects or a single category object if `id` is provided.
 *
 * @example
 * const result = await getCategories();
 * if (result.errorCode === 0) {
 *     console.log('Categories retrieved:', result.categories);
 * } else {
 *     console.error('Error:', result.errorMessage);
 * }
 */
export async function getProducts(id, categoryId, brandId, orderBy, order ) {
    const getProductReturn = {};
    try {
        //get product
        if (id) {
            const product = await Product.findById(id);
            
            if (!product || product.status !=='A') {
                getProductReturn.errorCode = 404;
                getProductReturn.errorMessage = 'No Product found';
                return getProductReturn;
            }
            getProductReturn.products = [product];
        } else {
            const query = { status: 'A' };
            let brand = {};
            let category = {};
            if (brandId){
                brand = await Brand.findById(brandId);
                query.brand = { $eq: brand };
            }
            if (categoryId){
                category = await Category.findById(categoryId);
                query.category = { $eq: category };
            }
            let productQuery = Product.find(query);
            let sortDirection = 1;
            if (order) {
                sortDirection = order === 'desc' ? -1 : 1;
            }
            if (!orderBy){
                orderBy = 'createdAt';
            }
            productQuery = productQuery.sort({ [orderBy]: sortDirection });
            const products = await productQuery.exec();
            if (!products || products.length == 0) {
                getProductReturn.errorCode = 404;
                getProductReturn.errorMessage = 'No Product found';
                return getProductReturn;
            }
            
            //return product lists
            getProductReturn.products = products;
        }
        getProductReturn.errorCode = 0;
        getProductReturn.errorMessage = "";
    } catch {
        getProductReturn.errorCode = 500;
        getProductReturn.errorMessage = 'Error Occurs';
    }
    return getProductReturn;
}

/**
 * Marks a category as deleted by changing its status to 'D'.
 *
 * @async
 * @function deleteCategory
 * @param {string} id - The ID of the category to delete.
 * @returns {Promise<Object>} A promise that resolves to an object containing the deletion result:
 * - `errorCode` {number} - `0` if successful, `404` if the category does not exist, or `500` for other errors.
 * - `errorMessage` {string} - Descriptive error message or an empty string on success.
 *
 * @example
 * const result = await deleteCategory('12345');
 * if (result.errorCode === 0) {
 *     console.log('Category deleted successfully.');
 * } else {
 *     console.error('Error:', result.errorMessage);
 * }
 */
export async function deleteProduct(id) {

    const deleteProductReturn = {};
    const sess = await mongoose.startSession();
    sess.startTransaction();

    try {
        //check if product exist
        const product = await Product.findById(id);

        if (!product || product.status !=='A') {
            deleteProductReturn.errorCode = 404;
            deleteProductReturn.errorMessage = 'No Product found';
            return deleteProductReturn;
        }

        //save modified product
        product.status = 'D';
        await product.save({ session: sess });
        await sess.commitTransaction();
        deleteProductReturn.errorCode = 0;
        deleteProductReturn.errorMessage = "";
    } catch {
        deleteProductReturn.errorCode = 500;
        deleteProductReturn.errorMessage = 'Error Occurs';
    }
    return deleteProductReturn;
}
