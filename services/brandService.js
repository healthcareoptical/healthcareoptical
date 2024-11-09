import { Brand } from '../models/brand.js';
import mongoose from 'mongoose';

export async function createBrand(brandNameZh, brandNameEn) {

    const createBrandReturn = {};
    const sess = await mongoose.startSession();
    sess.startTransaction();

    try {
        //check if brand exist
        const duplicatedBrand = await Brand.findOne({ $and :[{ brandNameEn: { $regex: new RegExp(`^${brandNameEn}$`, 'i') } }, {status :'A'} ]});

        if (duplicatedBrand) {
            createBrandReturn.errorCode = 409;
            createBrandReturn.errorMessage = 'Brand already exists';
            return createBrandReturn;
        }

        //create Brand if not exist
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

export async function updateBrand(id, brandNameZh, brandNameEn) {

    const updateBrandReturn = {};
    const sess = await mongoose.startSession();
    sess.startTransaction();

    try {
        //check if brand exist
        const brand = await Brand.findById(id);

        if (!brand || brand.status !== 'A') {
            updateBrandReturn.errorCode = 404;
            updateBrandReturn.errorMessage = 'Brand does not exists';
            return updateBrandReturn;
        }

        //save modified brand
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

export async function getBrands(id) {
    const getBrandsReturn = {};

    try {
        //get brand
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
            
            //return brand lists
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

export async function deleteBrand(id) {

    const deleteBrandReturn = {};
    const sess = await mongoose.startSession();
    sess.startTransaction();

    try {
        //check if brand exist
        const brand = await Brand.findById(id);

        if (!brand || brand.status !== 'A') {
            deleteBrandReturn.errorCode = 404;
            deleteBrandReturn.errorMessage = 'No brand found';
            return deleteBrandReturn;
        }

        //save modified brand
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