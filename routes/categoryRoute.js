import { Router } from "express";
import * as categoryController from '../controllers/categoryController.js';

const categoryRoute = Router();

//Handle user by categoryController.login
categoryRoute.route('/')
    .get(categoryController.getCategories)
    .post(categoryController.createCategory)
    .patch(categoryController.updateCategory)
    .delete(categoryController.deleteCategory);

export default categoryRoute;    