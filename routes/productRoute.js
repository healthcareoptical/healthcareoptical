import { Router } from "express";
import * as productConrtoller from '../controllers/productController.js';

const productRoute = Router();

//Handle user by productConrtoller.login
productRoute.route('/')
    .post(productConrtoller.createProduct)
    .patch(productConrtoller.updateProduct)
    .get(productConrtoller.getProducts)
    .delete(productConrtoller.deleteProduct);

export default productRoute;    