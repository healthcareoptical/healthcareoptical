import * as productService from '../services/productService.js';

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

