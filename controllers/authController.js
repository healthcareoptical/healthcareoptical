import * as authService from '../services/authService.js';
import { cookie } from '../config/config.js';

export async function login(req, res, next) {

    const response = await authService.login(req.body.userId, req.body.password);

    if (response.errorCode !== 0) {
        response.errorMessage = response.errorMessage || "Error Occurs";
        response.errorCode = response.errorCode || 500;
        return next(response);
    }

    res.cookie('jwt', response.refreshToken, cookie);
    res.status(200).json({ 'userId': response.userId, 'roles': response.roles });
}

export async function logout(req, res, next){
    res.clearCookie('jwt', cookie);
    res.status(200).json({ 'message' : 'Logout successfully' });
}