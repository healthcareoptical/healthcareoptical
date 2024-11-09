import * as menuService from '../services/menuService.js';

export async function getSelections(req, res, next) {

    let response = {};

    response = await menuService.getSelections();

    if (response.errorCode !== 0) {
        response.errorMessage = response.errorMessage || "Error Occurs";
        response.errorCode = response.errorCode || 500;
        return next(response);
    }

    res.status(200).json({ menu: response.menu});
}
