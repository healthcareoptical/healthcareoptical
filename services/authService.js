import { User } from '../models/user.js';
import { Role } from '../models/role.js';
import jsonwebtoken from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

/** 
 * Authenticates a user based on their user ID and password, and generates a refresh token upon successful login.
 * 
 * This function checks if the provided credentials match a valid active user in the database. 
 * If the credentials are valid, it returns the user details and a refresh token.
 * 
 * @async
 * @function login
 * @param {string} userId - The unique identifier for the user attempting to log in.
 * @param {string} password - The password provided by the user.
 * @returns {Promise<Object>} A promise that resolves to an object containing login results:
 * - If successful:
 *   - `errorCode` {number} - `0` indicates success.
 *   - `errorMessage` {string} - An empty string if there is no error.
 *   - `refreshToken` {string} - A JWT refresh token valid for 1 day.
 *   - `userId` {string} - The user ID of the authenticated user.
 *   - `roles` {Array<string>} - A list of roles associated with the user.
 * - If authentication fails:
 *   - `errorCode` {number} - `401` indicates invalid credentials.
 *   - `errorMessage` {string} - A descriptive message explaining the error.
 * 
 * @throws {Error} If an unexpected error occurs during execution.
 * 
 * @example
 * const result = await login('john_doe', 'password123');
 * if (result.errorCode === 0) {
 *     console.log('Login successful:', result);
 * } else {
 *     console.error('Login failed:', result.errorMessage);
 * }
 */

export async function login(userId, password) {
  
    const { sign } = jsonwebtoken;
    const { compare } = bcryptjs;
    const loginReturn = {};
    const user = await User.findOne({ $and :[{ userId: userId }, {status :'A'} ]}).populate('roles');
    if (!user) {
        loginReturn.errorCode = 401;
        loginReturn.errorMessage = 'Invalid user id and password';
        return loginReturn;
    };

    if (user.password) {
        const isCorrectPassword = await compare(password, user.password);
        if (!isCorrectPassword) {
            loginReturn.errorCode = 401 ;
            loginReturn.errorMessage = 'Invalid user id and password';
            return loginReturn;
        }
    }

    const refreshToken = sign(
        { "userId": user.userId },
        process.env.REFRESH_KEY || 'MY_SECRET_REFRESH_KEY',
        { expiresIn: '1d' }
    );

    user.password = "";
    loginReturn.errorCode = 0;
    loginReturn.errorMessage = '';
    loginReturn.refreshToken = refreshToken;
    loginReturn.userId = user.userId;
    loginReturn.roles = user.roles.map(role => role.roleName);
    return loginReturn;
}
