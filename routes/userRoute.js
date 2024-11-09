import { Router } from "express";
import * as userController from '../controllers/userController.js';

const userRoute = Router();

//Handle user by userController.login
userRoute.route('/')
    .get(userController.getUsers)
    .post(userController.createUser)
    .patch(userController.updateUser)
    .delete(userController.deleteUser);

export default userRoute;    