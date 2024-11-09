import * as userService from '../services/userService.js';

export async function createUser(req, res, next) {

    const password = req.body.password;
    const reEntryPassword = req.body.reEntryPassword;
    const roleNames = req.body.roleNames || ['staff'];
    const userId = req.body.userId;
    let response = {};

    if (!password || !reEntryPassword || password !== reEntryPassword) {
        response.errorMessage = "Password does not match";
        response.errorCode = 401;
        return next(response);
    }

    if (!userId){
        response.errorMessage = "Please enter userId";
        response.errorCode = 401;
        return next(response);
    }

    response = await userService.createUser(userId, password, roleNames);

    if (response.errorCode !== 0) {
        response.errorMessage = response.errorMessage || "Error Occurs";
        response.errorCode = response.errorCode || 500;
        return next(response);
    }

    res.status(201).json({ message:'User Created'});
}

export async function updateUser(req, res, next) {

    const password = req.body.password;
    const reEntryPassword = req.body.reEntryPassword;
    const userId = req.body.userId;
    let response = {};


    if (!password || !reEntryPassword || password !== reEntryPassword) {
        response.errorMessage = "Password does not match";
        response.errorCode = 401;
        return next(response);
    }

    if (!userId){
        response.errorMessage = "Please enter userId";
        response.errorCode = 401;
        return next(response);
    }

    response = await userService.updateUser(userId, password);

    if (response.errorCode !== 0) {
        response.errorMessage = response.errorMessage || "Error Occurs";
        response.errorCode = response.errorCode || 500;
        return next(response);
    }

    res.status(200).json({ message:'User updated'});
}

export async function getUsers(req, res, next) {

    let response = {};
    const userId = req.query.userId || null;
    response = await userService.getUsers(userId);

    if (response.errorCode !== 0) {
        response.errorMessage = response.errorMessage || "Error Occurs";
        response.errorCode = response.errorCode || 500;
        return next(response);
    }

    res.status(200).json({ users:response.users});
}

export async function deleteUser(req, res, next) {

    let response = {};
    const userId = req.body.userId;
    response = await userService.deleteUser(userId);

    if (response.errorCode !== 0) {
        response.errorMessage = response.errorMessage || "Error Occurs";
        response.errorCode = response.errorCode || 500;
        return next(response);
    }

    res.status(200).json({ message: 'User Deleted'});
}

