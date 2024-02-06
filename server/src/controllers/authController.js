const createError = require('http-errors');
const User = require('../models/userModel');
const { successResponse } = require('./responseController');
const { createJSONWebToken } = require('../helper/jsonwebtoken');
const { jwtaccessKey } = require('../secret');
const bcrypt = require('bcryptjs');

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
            {_id:user._id},
            jwtaccessKey,
            '10m'
            );
            res.cookie('accessToken', accessToken, {
                maxAge: 15 * 60 * 1000, // 15 minutes
                httpOnly: true,
                sameSite: 'none'
            });
              
        //success response
        return successResponse(res,{
            statusCode:200,
            message:'Users loggedin successfull',
            payload:{user}
        })
        
    } catch (error) {
        next(error);
    }
}

const handleLogout = async(req,res,next)=>{
    try {
        res.clearCookie('accessToken');
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

module.exports = {handleLogin,handleLogout};