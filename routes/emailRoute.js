import { Router } from "express";
import * as emailController from '../controllers/emailController.js';

const emailRoute = Router();

//Handle user by emailController
emailRoute.route('/')
    .post(emailController.sendEmail)

export default emailRoute;    