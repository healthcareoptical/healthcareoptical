import { Category } from '../models/category.js';
import mongoose from 'mongoose';

export async function createCategory(categoryNameZh, categoryNameEn) {

    const createCategoryReturn = {};
    const sess = await mongoose.startSession();
    sess.startTransaction();

    try {
        //check if category exist
        const duplicatedCategory = await Category.findOne({ $and :[{ categoryNameEn: { $regex: new RegExp(`^${categoryNameEn}$`, 'i') } }, {status :'A'} ]});

        if (duplicatedCategory) {
            createCategoryReturn.errorCode = 409;
            createCategoryReturn.errorMessage = 'Category already exists';
            return createCategoryReturn;
        }

        //create category if not exist
        await Category.create([{
            categoryNameEn: categoryNameEn,
            categoryNameZh: categoryNameZh,
            status: 'A'
        }], { session: sess });
        
        createCategoryReturn.errorCode = 0;
        createCategoryReturn.errorMessage = '';
        await sess.commitTransaction();
    } catch {
        createCategoryReturn.errorCode = 500;
        createCategoryReturn.errorMessage = 'Error Occurs';
    }
    sess.endSession();
    return createCategoryReturn;
}

export async function updateCategory(id, categoryNameZh, categoryNameEn) {

    const updateCategoryReturn = {};
    const sess = await mongoose.startSession();
    sess.startTransaction();

    try {
        //check if category exist
        const category = await Category.findById(id);

        if (!category || category.status !== 'A') {
            updateCategoryReturn.errorCode = 404;
            updateCategoryReturn.errorMessage = 'Category does not exist';
            return updateCategoryReturn;
        }

        //save modified user
        category.categoryNameZh = categoryNameZh;
        category.categoryNameEn = categoryNameEn;
        await category.save({ session: sess });
        await sess.commitTransaction();
        updateCategoryReturn.errorCode = 0;
        updateCategoryReturn.errorMessage = "";
    } catch {
        updateCategoryReturn.errorCode = 500;
        updateCategoryReturn.errorMessage = 'Error Occurs';
    }
    sess.endSession();
    return updateCategoryReturn;
}

export async function getCategories(id) {
    const getCategoriesReturn = {};

    try {
        //get category
        if (id) {
            const category = await Category.findById(id);
            if (!category) {
                getCategoriesReturn.errorCode = 404;
                getCategoriesReturn.errorMessage = 'No category found';
                return getCategoriesReturn;
            }
            getCategoriesReturn.categories = [category];
        } else {
            const categories = await Category.find({status :'A'});

            if (!categories || categories.length == 0) {
                getCategoriesReturn.errorCode = 404;
                getCategoriesReturn.errorMessage = 'No category found';
                return getCategoriesReturn;
            }
            
            //return category lists
            getCategoriesReturn.categories = categories;
        }
        getCategoriesReturn.errorCode = 0;
        getCategoriesReturn.errorMessage = "";
    } catch {
        getCategoriesReturn.errorCode = 500;
        getCategoriesReturn.errorMessage = 'Error Occurs';
    }
    return getCategoriesReturn;
}

export async function deleteCategory(id) {

    const deleteCategoryReturn = {};
    const sess = await mongoose.startSession();
    sess.startTransaction();

    try {
        //check if category exist
        const category = await Category.findById(id);

        if (!category || category.status !== 'A') {
            deleteCategoryReturn.errorCode = 404;
            deleteCategoryReturn.errorMessage = 'No category found';
            return deleteCategoryReturn;
        }

        //save modified user
        category.status = 'D';
        await category.save({ session: sess });
        await sess.commitTransaction();
        deleteCategoryReturn.errorCode = 0;
        deleteCategoryReturn.errorMessage = "";
    } catch {
        deleteCategoryReturn.errorCode = 500;
        deleteCategoryReturn.errorMessage = 'Error Occurs';
    }
    return deleteCategoryReturn;
}