import * as categoryService from '../services/categoryService.js';

export async function createCategory(req, res, next) {

    const categoryNameZh = req.body.categoryNameZh;
    const categoryNameEn = req.body.categoryNameEn;
    let response = {};

    if (!categoryNameZh || !categoryNameEn) {
        response.errorMessage = "Category name is not provided";
        response.errorCode = 401;
        return next(response);
    }

    response = await categoryService.createCategory(categoryNameZh, categoryNameEn);

    if (response.errorCode !== 0) {
        response.errorMessage = response.errorMessage || "Error Occurs";
        response.errorCode = response.errorCode || 500;
        return next(response);
    }

    res.status(201).json({ message:'Category Created'});
}

export async function updateCategory(req, res, next) {

    const id = req.body.id;
    const categoryNameZh = req.body.categoryNameZh;
    const categoryNameEn = req.body.categoryNameEn;
    let response = {};

    if (!id || !categoryNameZh || !categoryNameEn) {
        response.errorMessage = "Please provide updated category information";
        response.errorCode = 401;
        return next(response);
    }

    response = await categoryService.updateCategory(id, categoryNameZh, categoryNameEn);

    if (response.errorCode !== 0) {
        response.errorMessage = response.errorMessage || "Error Occurs";
        response.errorCode = response.errorCode || 500;
        return next(response);
    }

    res.status(200).json({ message:'Category updated'});
}

export async function getCategories(req, res, next) {

    let response = {};
    const id = req.query.id || null;
    response = await categoryService.getCategories(id);

    if (response.errorCode !== 0) {
        response.errorMessage = response.errorMessage || "Error Occurs";
        response.errorCode = response.errorCode || 500;
        return next(response);
    }

    res.status(200).json({ categories:response.categories});
}

export async function deleteCategory(req, res, next) {

    let response = {};
    const id = req.body.id;
    response = await categoryService.deleteCategory(id);

    if (response.errorCode !== 0) {
        response.errorMessage = response.errorMessage || "Error Occurs";
        response.errorCode = response.errorCode || 500;
        return next(response);
    }

    res.status(200).json({ message: 'Category Deleted'});
}

