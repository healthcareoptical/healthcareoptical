import { Router } from "express";
import * as menuController from '../controllers/menuController.js';

const menuRoute = Router();

//Handle menu by menuController
menuRoute.route('/')
    .get(menuController.getSelections);

export default menuRoute;    