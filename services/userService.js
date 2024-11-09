import { User } from '../models/user.js';
import { Role } from '../models/role.js';
import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';


const { hash } = bcryptjs;

export async function createUser(userId, password, roleNames) {

    const createUserReturn = {};
    const sess = await mongoose.startSession();
    sess.startTransaction();

    try {
        //check if user exist
        const duplicatedUser = await User.findOne({ $and :[{ userId: { $regex: new RegExp(`^${userId}$`, 'i') } }, {status :'A'} ]});

        if (duplicatedUser) {
            createUserReturn.errorCode = 409;
            createUserReturn.errorMessage = 'User already exists';
            return createUserReturn;
        }

        //check if role exists
        const roles = await Role.find({ $and :[ {roleName: roleNames}, {status:'A'}] });

        if (!roles || roles.length == 0){
            createUserReturn.errorCode = 409;
            createUserReturn.errorMessage = 'Role does not exists';
            return createUserReturn;
        }

        //create user if not exist
        await User.create([{
            userId: userId,
            password: await hash(password, 12),
            status: 'A',
            roles: roles
        }], { session: sess });

        createUserReturn.errorCode = 0;
        createUserReturn.errorMessage = '';
        await sess.commitTransaction();
    } catch {
        createUserReturn.errorCode = 500;
        createUserReturn.errorMessage = 'Error Occurs';
    }
    sess.endSession();
    return createUserReturn;
}

export async function updateUser(userId, password) {

    const updateUserReturn = {};
    const sess = await mongoose.startSession();
    sess.startTransaction();

    try {
        //check if user exist
        const user = await User.findOne({ $and :[{ userId: userId }, {status :'A'} ]});

        if (!user) {
            updateUserReturn.errorCode = 404;
            updateUserReturn.errorMessage = 'User does not exists';
            return updateUserReturn;
        }

        //save modified user
        user.password = await hash(password, 12);
        await user.save({ session: sess });
        await sess.commitTransaction();
        updateUserReturn.errorCode = 0;
        updateUserReturn.errorMessage = "";
    } catch {
        updateUserReturn.errorCode = 500;
        updateUserReturn.errorMessage = 'Error Occurs';
    }
    sess.endSession();
    return updateUserReturn;
}

export async function getUsers(userId) {
    const getUsersReturn = {};

    try {
        //get users
        if (userId) {
            const user = await User.findOne({ $and :[{ userId: userId }, {status :'A'} ]}).select('-password -roles');

            if (!user) {
                getUsersReturn.errorCode = 404;
                getUsersReturn.errorMessage = 'No user found';
                return getUsersReturn;
            }
            getUsersReturn.users = [user];
        } else {
            const users = await User.find({status :'A'}).select('-password -roles');

            if (!users || users.length == 0) {
                getUsersReturn.errorCode = 404;
                getUsersReturn.errorMessage = 'No user found';
                return getUsersReturn;
            }
            
            //return user lists
            getUsersReturn.users = users;
        }
        getUsersReturn.errorCode = 0;
        getUsersReturn.errorMessage = "";
    } catch {
        getUsersReturn.errorCode = 500;
        getUsersReturn.errorMessage = 'Error Occurs';
    }
    return getUsersReturn;
}

export async function deleteUser(userId) {

    const deleteUserReturn = {};
    const sess = await mongoose.startSession();
    sess.startTransaction();

    try {
        //check if user exist
        const user = await User.findOne({ $and :[{ userId: userId }, {status :'A'} ]});

        if (!user) {
            deleteUserReturn.errorCode = 404;
            deleteUserReturn.errorMessage = 'No user found';
            return deleteUserReturn;
        }

        //save modified user
        user.status = 'D';
        await user.save({ session: sess });
        await sess.commitTransaction();
        deleteUserReturn.errorCode = 0;
        deleteUserReturn.errorMessage = "";
    } catch {
        deleteUserReturn.errorCode = 500;
        deleteUserReturn.errorMessage = 'Error Occurs';
    }
    return deleteUserReturn;
}