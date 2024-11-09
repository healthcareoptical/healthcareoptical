import { Router } from "express";
import * as brandConrtoller from '../controllers/brandController.js';

const brandRoute = Router();

//Handle user by brandConrtoller.login
brandRoute.route('/')
    .get(brandConrtoller.getBrands)
    .post(brandConrtoller.createBrand)
    .patch(brandConrtoller.updateBrand)
    .delete(brandConrtoller.deleteBrand);

export default brandRoute;    