import { User } from '../models/user.js';
import { Role } from '../models/role.js';
import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';

const { hash } = bcryptjs;

/**
 * Creates a new user with the specified roles.
 *
 * @async
 * @function createUser
 * @param {string} userId - The ID of the new user.
 * @param {string} password - The password for the new user (hashed during creation).
 * @param {string[]} roleNames - An array of role names to assign to the user.
 * @returns {Promise<Object>} A promise that resolves to an object containing the creation result:
 * - `errorCode` {number} - `0` if successful, `409` if the user or roles already exist, or `500` for other errors.
 * - `errorMessage` {string} - Descriptive error message or an empty string on success.
 *
 * @example
 * const result = await createUser('john_doe', 'password123', ['Admin', 'Editor']);
 * if (result.errorCode === 0) {
 *     console.log('User created successfully.');
 * } else {
 *     console.error('Error:', result.errorMessage);
 * }
 */
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
            createUserReturn.errorMessage = 'Role does not exist';
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

/**
 * Updates the password of an existing user.
 *
 * @async
 * @function updateUser
 * @param {string} userId - The ID of the user to update.
 * @param {string} password - The new password for the user (hashed during update).
 * @returns {Promise<Object>} A promise that resolves to an object containing the update result:
 * - `errorCode` {number} - `0` if successful, `404` if the user does not exist, or `500` for other errors.
 * - `errorMessage` {string} - Descriptive error message or an empty string on success.
 *
 * @example
 * const result = await updateUser('john_doe', 'new_password123');
 * if (result.errorCode === 0) {
 *     console.log('User password updated successfully.');
 * } else {
 *     console.error('Error:', result.errorMessage);
 * }
 */

export async function updateUser(userId, password) {

    const updateUserReturn = {};
    const sess = await mongoose.startSession();
    sess.startTransaction();

    try {
        //check if user exist
        const user = await User.findOne({ $and :[{ userId: userId }, {status :'A'} ]});

        if (!user) {
            updateUserReturn.errorCode = 404;
            updateUserReturn.errorMessage = 'User does not exist';
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

/**
 * Retrieves user(s) from the database.
 *
 * @async
 * @function getUsers
 * @param {string} [userId] - The ID of a specific user to retrieve. If not provided, all active users are returned.
 * @returns {Promise<Object>} A promise that resolves to an object containing the retrieval result:
 * - `errorCode` {number} - `0` if successful, `404` if no users are found, or `500` for other errors.
 * - `errorMessage` {string} - Descriptive error message or an empty string on success.
 * - `users` {Array<Object>} - An array of user objects without sensitive data like passwords.
 *
 * @example
 * const result = await getUsers('john_doe');
 * if (result.errorCode === 0) {
 *     console.log('User retrieved:', result.users);
 * } else {
 *     console.error('Error:', result.errorMessage);
 * }
 */

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

/**
 * Marks a user as deleted by changing their status to 'D'.
 *
 * @async
 * @function deleteUser
 * @param {string} userId - The ID of the user to delete.
 * @returns {Promise<Object>} A promise that resolves to an object containing the deletion result:
 * - `errorCode` {number} - `0` if successful, `404` if the user does not exist, or `500` for other errors.
 * - `errorMessage` {string} - Descriptive error message or an empty string on success.
 *
 * @example
 * const result = await deleteUser('john_doe');
 * if (result.errorCode === 0) {
 *     console.log('User deleted successfully.');
 * } else {
 *     console.error('Error:', result.errorMessage);
 * }
 */

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