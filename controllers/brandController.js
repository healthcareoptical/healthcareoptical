import * as brandService from '../services/brandService.js';

export async function createBrand(req, res, next) {

    const brandNameZh = req.body.brandNameZh;
    const brandNameEn = req.body.brandNameEn;
    let response = {};

    if (!brandNameZh || !brandNameEn) {
        response.errorMessage = "Brand name is not provided";
        response.errorCode = 401;
        return next(response);
    }

    response = await brandService.createBrand(brandNameZh, brandNameEn);

    if (response.errorCode !== 0) {
        response.errorMessage = response.errorMessage || "Error Occurs";
        response.errorCode = response.errorCode || 500;
        return next(response);
    }

    res.status(201).json({ message:'Brand Created'});
}

export async function updateBrand(req, res, next) {

    const id = req.body.id;
    const brandNameZh = req.body.brandNameZh;
    const brandNameEn = req.body.brandNameEn;
    let response = {};

    if (!id || !brandNameZh || !brandNameEn) {
        response.errorMessage = "Please provide updated brand information";
        response.errorCode = 401;
        return next(response);
    }

    response = await brandService.updateBrand(id, brandNameZh, brandNameEn);

    if (response.errorCode !== 0) {
        response.errorMessage = response.errorMessage || "Error Occurs";
        response.errorCode = response.errorCode || 500;
        return next(response);
    }

    res.status(200).json({ message:'Brand updated'});
}

export async function getBrands(req, res, next) {

    let response = {};
    const id = req.query.id || null;
    response = await brandService.getBrands(id);

    if (response.errorCode !== 0) {
        response.errorMessage = response.errorMessage || "Error Occurs";
        response.errorCode = response.errorCode || 500;
        return next(response);
    }

    res.status(200).json({ brands:response.brands});
}

export async function deleteBrand(req, res, next) {

    let response = {};
    const id = req.body.id;
    response = await brandService.deleteBrand(id);

    if (response.errorCode !== 0) {
        response.errorMessage = response.errorMessage || "Error Occurs";
        response.errorCode = response.errorCode || 500;
        return next(response);
    }

    res.status(200).json({ message: 'Brand Deleted'});
}

