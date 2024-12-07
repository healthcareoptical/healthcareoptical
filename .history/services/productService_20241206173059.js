import { Product } from '../models/product.js';
import { Brand } from '../models/brand.js';
import { Category } from '../models/category.js';
import mongoose from 'mongoose';
import { uploadImage } from '../middlewares/uploadFile.js';


export async function createProduct(file, modelNo, price, discountPrice, prodDescEn, prodDescZh, prodNameEn, prodNameZh, categoryId, brandId) {

    const createProductReturn = {};
    const sess = await mongoose.startSession();
    sess.startTransaction();

    try {
        //check if product exist
        const duplicatedProduct = await Product.findOne({ $and :[{ modelNo: modelNo }, {status :'A'} ]});

        if (duplicatedProduct) {
            createProductReturn.errorCode = 409;
            createProductReturn.errorMessage = 'Product already exists';
            return createProductReturn;
        }

        //check if category exists
        const categoryFound = await Category.findById(categoryId);

        if (!categoryFound || categoryFound.status !== 'A'){
            createProductReturn.errorCode = 409;
            createProductReturn.errorMessage = 'Category does not exist';
            return createProductReturn;
        }

        //check if brand exists
        const brandFound = await Brand.findById(brandId);

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

        createProductReturn.errorCode = 0;
        createProductReturn.errorMessage = '';
        await sess.commitTransaction();
    } catch {
        createProductReturn.errorCode = 500;
        createProductReturn.errorMessage = 'Error Occurs';
    }
    sess.endSession();
    return createProductReturn;
}

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
            updateProductReturn.errorMessage = 'Brand does not exists';
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
            let sortDirtection = 1;
            if (order) {
                sortDirtection = order === 'desc' ? -1 : 1;
            }
            if (!orderBy){
                orderBy = 'createdAt';
            }
            productQuery = productQuery.sort({ [orderBy]: sortDirtection });
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