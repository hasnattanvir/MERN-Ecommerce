const createError = require('http-errors');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const { successResponse } = require('./responseController');
const { createJSONWebToken } = require('../helper/jsonwebtoken');
const { jwtaccessKey,jwtrefressKey } = require('../secret');
const bcrypt = require('bcryptjs');
const { setAccessTokenCookie, setRefreshTokenCookie } = require('../helper/cookie');

const handleLogin = async(req,res,next)=>{
    try {
        // login/email,password .req.body
        const {email,password}= req.body
        //isExist
        const user = await User.findOne({email});
        if(user.isBanned){
            throw createError(403, 'You are Banned.please contact authority '); 
        }
        //compare the password
        const isPasswordMatch = await bcrypt.compare(password,user.password);
        if(!isPasswordMatch){
            throw createError(
                401,
                'User does not exist with the email. please register first'
            );
        }
        //isBanned
        const isBanned = await bcrypt.compare(password,user.password);
        if(!isPasswordMatch){
            throw createError(401,'Email/password did not match');
        }

        //token,cookie
        const accessToken = createJSONWebToken(
            // {_id:user._id},
            {user},
            jwtaccessKey,
            '5m'
            );

            // res.cookie('accessToken', accessToken, {
            //     // maxAge: 1 * 60 * 1000, // 1 DAY
            //     maxAge: 5 * 60 * 1000, // 15 minutes
            //     httpOnly: true,
            //     sameSite: 'none'
            // });

            setAccessTokenCookie(res,accessToken);
        // refreshToken
        const refreshToken = createJSONWebToken(
            // {_id:user._id},
            {user},
            // jwtaccessKey,
            jwtrefressKey,
            '7d'
            );
            // res.cookie('refreshToken', refreshToken, {
            //     maxAge:7 * 24 * 60 * 60 * 1000, // 7 DAY
            //     httpOnly: true,
            //     sameSite: 'none'
            // });
            setRefreshTokenCookie(res,refreshToken);


        // const userWithoutPassword = await User.findOne({email}).select('-password');
        const userWithoutPassword = user.toObject();
        delete userWithoutPassword.password;
              
        //success response
        return successResponse(res,{
            statusCode:200,
            message:'Users loggedin successfull',
            payload:{userWithoutPassword}
        })
        
    } catch (error) {
        next(error);
    }
}


const handleLogout = async(req,res,next)=>{
    try {
        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');
        //success response
        return successResponse(res,{
            statusCode:200,
            message:'Users logOut successfull',
            payload:{}
        })
        
    } catch (error) {
        next(error);
    }
}


const handleRefreshToken = async(req,res,next)=>{
    try {
        const oldRefreshToken = req.cookies.refreshToken;

        //verify the old refresh token
        const decodedToken = jwt.verify(oldRefreshToken,jwtrefressKey);
        if(!decodedToken){
            throw createError(401,'Invalid refresh token please login again')
        }
        // const accessToken = createJSONWebToken({user},jwtaccessKey,'1m');

        const accessToken = createJSONWebToken(
            decodedToken.user,
            jwtaccessKey,
            '1m'
            );
            // res.cookie('accessToken', accessToken, {
            //     maxAge: 1 * 60 * 1000, // 1 DAY
            //     httpOnly: true,
            //     sameSite: 'none'
            // });
            setAccessTokenCookie(res,accessToken);
        return successResponse(res,{
            statusCode:200,
            message:'Users logOut successfull',
            payload:{}
        })
        
    } catch (error) {
        next(error);
    }
}

// Protected Route
const handleProtectedRoute = async(req,res,next)=>{
    try {
        const accessToken = req.cookies.accessToken;

        //verify the old refresh token
        const decodedToken = jwt.verify(accessToken,jwtaccessKey);
        if(!decodedToken){
            throw createError(401,'Invalid access token please login again')
        }
        
        return successResponse(res,{
            statusCode:200,
            message:'Protected resourcess accessed successfull',
            payload:{}
        })
        
    } catch (error) {
        next(error);
    }
}

module.exports = {
    handleLogin,
    handleLogout,
    handleRefreshToken,
    handleProtectedRoute
};