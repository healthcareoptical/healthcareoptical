import { User } from '../models/user.js';
import { Role } from '../models/role.js';
import jsonwebtoken from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

export async function login(userId, password) {
  
    //check if user exist
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
