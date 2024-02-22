const createError = require('http-errors');
const jwt = require('jsonwebtoken');
const fs = require('fs').promises;
const User = require('../models/userModel');
const { successResponse } = require('./responseController');
const {findWithID} = require('../services/findItem');
const { deleteImage } = require('../helper/deleteImage');
const { jwtactivationKey, clientURL, jwtresetPassKey } = require('../secret');
const { createJSONWebToken } = require('../helper/jsonwebtoken');
const EmailWithNodeMailer = require('../helper/email');
const { log } = require('console');
const bcrypt = require('bcryptjs');
const {handleUserAction, findUsers, findUserById, deleteUserById, updateUserById, ForgotPassworByEmail, ResetPassworByEmail} = require('../services/userService');
const { default: mongoose } = require('mongoose');
const checkUserExists = require('../helper/chekUserExits');
const sendEmail = require('../helper/sendEmail');

// Get All User
const handlegetUsers = async(req,res,next)=>{
    // console.log("user profile");
    // console.log(req.user);
    try{
        const search = req.query.search || "";
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 5;

       const {users,pagination,} = await findUsers(search,limit,page);
        return successResponse(res,{
            statusCode:200,
            message:'Users Were Returned successfully',
            payload:{
                message:"User was Return",
                users:users,
                pagination:pagination,
                
            }
        })
    }catch(error){
        // res.status(500).send(message.error);
        next(error);
    }
};
// Find User
const handlegetUserById = async(req,res,next)=>{
    try{
    //    console.log(req.body.userId);
    // console.log(req.user);

       const id = req.params.id;
       const options ={password:0};
       const user = await findUserById(id,options);
    //    const options = {password:0};
    //    //
    //    const user = await User.findById(id,options);
    //    //
    //    if(!user){
    //     throw createError(404,"User does not exist with this id");
    //    }
        return successResponse(res,{
            statusCode:200,
            message:'User Were Returned successfully',
            payload:{user},
        })
    }catch(error){
        //
        // res.status(500).send(message.error);
        // if(error instanceof mongoose.Error){
        //     next(createError(400,'Invalid User Id'));
        //     return;
        // };
        next(error);
    }
};
// Delete User
const handledeleteUserById = async(req,res,next)=>{
    try{
       const id = req.params.id;
       const options ={password:0};
       await deleteUserById(id,options);
        return successResponse(res,{
            statusCode:200,
            message:'User Wes Delete successfully',
            // payload:{user},
        })
    }catch(error){
        next(error);
    }
};
// Register User
const handleprocessRegister = async(req,res,next)=>{
    try{
        const {name,email,password,phone,address} = req.body;
        // added new
        const image = req.file?.path;
        if(image && image.size>1024 * 1024 *2){
            throw createError(400,'File too large.It must be less then 2 MB');
        } 

        // const userExists = await User.exists({email:email});
        const userExists = await checkUserExists(email);

        if(userExists){
            throw createError(409,'User already exits. please login');
        }

        const tokenPayload = {
            name,
            email,
            password,
            phone,
            address,
        }
        if(image){
            tokenPayload.image = image
        }

        const token = createJSONWebToken(
            tokenPayload,
            jwtactivationKey,
            '10m'
            );
        
        //prepare email
        const emailData = {
            email,
            subject:'Account Activation Email',
            html:`
            <h2>Hello ${name} ! </h2>
            <p>Please click here to link <a href="${clientURL}/api/users/activate/${token}" target="_blank">activate your account</a></p>
            `
        }
        //send email
      sendEmail(emailData);
        return successResponse(res,{
            statusCode:200,
            message:`Please go to your email ${email}  for completing your registerton process`,
            payload:token,
        })
    }catch(error){
        next(error);
    }
};
// active or verify user
const handleactivateuserAccount = async(req,res,next)=>{
    try{
        const token = req.body.token;
        if(!token) {
            throw createError(404, 'token not found');
        }

        try{
            const decoded = jwt.verify(token,jwtactivationKey);
            // console.log(decoded);
            if(!decoded) throw createError(401,'user was not able to verified');
            const userExists = await User.exists({email:decoded.email});
            if(userExists){
                throw createError(409,'User already exits. please login');
            }
            await User.create(decoded);
            return successResponse(res,{
                statusCode:201,
                message:`user was registered successfully`,
            })

        }catch(error){
            if(error.name === 'TokenExpiredError'){
                throw createError(401,'Token has Expired');
            }else if(error.name==='JsonWebTokenError'){
                throw createError(401,'Invalid Token');
            }else{
                throw error;
            }
        }
    }catch(error){
        next(error);
    }
};
// Update User 
const handleupdateUserById = async(req,res,next)=>{
    try{

        const userId = req.params.id;
        
        const updatedUser = await updateUserById(userId,req);

        return successResponse(res,{
            statusCode:200,
            message:'user was update successfully',
            payload:updatedUser,
        });

    }catch(error){
        console.log(error); // Check the error type and properties
        if (error instanceof mongoose.Error.CastError) {
            throw createError(400, 'Invalid Id');
        }
        next(error);
    }
};

// we safarate ban and unban handler but nex we use its one controler it just not remove
const handleBanUserId = async(req,res,next)=>{
    try{

        const userId = req.params.id;
        await findWithID(User,userId);
        const updates = {isBanned:true}
        const updateOptions = {new:true, runvalidators:true, context:'query'}; 

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            updates,
            updateOptions
            ).select("-password");
        if(!updatedUser){
            throw createError(404,'User was not banned successfull');
        }

        return successResponse(res,{
            statusCode:200,
            message:'user was banned successfully',
            // payload:updatedUser,
        });

    }catch(error){
        next(error);
    }
};

const handleUnBanUserId = async(req,res,next)=>{
    try{
        const userId = req.params.id;
        await findWithID(User,userId);
        const updates = {isBanned:false}
        const updateOptions = {new:true, runvalidators:true, context:'query'}; 

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            updates,
            updateOptions
            ).select("-password");
        if(!updatedUser){
            throw createError(404,'User was not Unbanned successfull');
        }

        return successResponse(res,{
            statusCode:200,
            message:'user was banned successfully',
            // payload:updatedUser,
        });

    }catch(error){
        next(error);
    }
};
// manage user
const handleManageUserId = async(req,res,next)=>{
    try{
        let userId = req.params.id;
        let action = req.body.action;
        let successMessage = await handleUserAction(action,userId);

        return successResponse(res,{
            statusCode:200,
            message:successMessage
            // payload:updatedUser,
        });

    }catch(error){
        next(error);
    }
};
//update password 
const handleUpdatePassword = async(req,res,next)=>{
    try{
        const {oldPassword,newPassword,confirmPassword} = req.body;
        const userId = req.params.id;
        const user = await findWithID(User,userId);

        const isPasswordMatch = await bcrypt.compare(oldPassword,user.password);
        if(!isPasswordMatch){
            throw createError(
                401,
                'old password did not match'
            );
        }
        // const filter = {userId}
        // const update = {$set: {password:newPassword}}
        // const updateOptions = new{new:true}
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {password:newPassword},
            {new:true}
        ).select('-password');

        return successResponse(res,{
            statusCode:200,
            message:'User was updated successfull',
            payload:{updatedUser},
        });

    }catch(error){
        next(error);
    }
};
//forgot password
const handleForgetPassword = async(req,res,next)=>{
    try{

        const {email} = req.body;
        const token = await ForgotPassworByEmail(email);

        return successResponse(res,{
            statusCode:200,
            message:`Please go to your email ${email}  for Reset Password`,
            payload:token,
        })

    }catch(error){
        next(error);
    }
};
// reset password
const handleResetPassword = async(req,res,next)=>{
    try{
        const {token,password} = req.body;
        await ResetPassworByEmail(token,password);   
        return successResponse(res,{
            statusCode:200,
            message:'Password Reset SuccessFully',
        });

    }catch(error){
        next(error);
    }
};

module.exports ={
    handlegetUsers,
    handlegetUserById,
    handledeleteUserById,
    handleprocessRegister,
    handleactivateuserAccount,
    handleupdateUserById,
    handleManageUserId,
    handleUpdatePassword,
    handleForgetPassword,
    handleResetPassword
    // handleBanUserId,
    // handleUnBanUserId
};