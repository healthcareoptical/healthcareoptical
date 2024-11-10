import { Router } from "express";
import * as productConrtoller from '../controllers/productController.js';
import { upload } from "../middlewares/uploadFile";

const productRoute = Router();

//Handle user by productConrtoller.login
productRoute.route('/')
    .post(upload.single(file), productConrtoller.createProduct)
    .patch(productConrtoller.updateProduct)
    .get(productConrtoller.getProducts)
    .delete(productConrtoller.deleteProduct);

export default productRoute;    
