import { Router } from "express";
import * as authController from '../controllers/authController.js';

const authRoute = Router();

//Handle login by authController.login
authRoute.route('/login').
    post(authController.login);

//Handle logout by authController.login
authRoute.route('/logout').
    post(authController.logout);

export default authRoute;    