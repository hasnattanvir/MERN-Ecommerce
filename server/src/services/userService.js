const mongoose = require('mongoose');
const createError = require('http-errors');
const User = require("../models/userModel");
const { deleteImage } = require('../helper/deleteImage');
const { createJSONWebToken } = require('../helper/jsonwebtoken');
const { jwtresetPassKey, clientURL } = require('../secret');
const jwt = require('jsonwebtoken');
const EmailWithNodeMailer = require('../helper/email');

const findUsers = async (search,limit,page)=>{
    try{
        const searchRegExp = new RegExp('.*'+search+".*",'i');
        const filter = {
            isAdmin:{$ne: true},
            $or:[
                {name:{$regex:searchRegExp}},
                {email:{$regex:searchRegExp}},
                {phone:{$regex:searchRegExp}}
            ]
        };
        const options = {password:0}
        const users = await User.find(filter,options).limit(limit).skip((page-1)*limit);
        const count = await User.find(filter).countDocuments();
        if(!users) throw createError(404,"no users found");
        return{
            users,
            pagination:{
                totalPages:Math.ceil(count/limit),
                currentPage:page,
                previousPage:page-1 > 0 ? page-1:null,
                nextPage:page+1 <= Math.ceil(count/limit) ? page+1:null,
            }
        }
    }catch(error){
        throw(error);
    }
}

const findUserById = async(id, options={})=>{
 try{
    const user = await User.findById(id,options);
    if(!user){
        throw  createError(404,'User Not Found');
    }
    return user;
 }catch(error){
    throw(error);
 }
}

const deleteUserById = async(id, options={})=>{
 try{
    const user = await User.findByIdAndDelete({_id:id,isAdmin:false})
    if(user && user.image){
     await deleteImage(user.image);
    }
    
 }catch(error){
    throw(error);
 }
}

const updateUserById = async(userId,req)=>{
 try{
    const options ={password:0};
    const user = await findUserById(userId,options);

    const updateOptions = {new:true, runvalidators:true, context:'query'}; 
    let updates = {};
    const allowedFields = ['name','password','phone','address'];
    for(let key in req.body){
        if(allowedFields.includes(key)){
            updates[key] = req.body[key];
        }else if(key==='email'){
            // throw new Error("email can't update");
            throw createError(400,"email can't update");
        }
    } 
    const image = req.file.path; 
    if(image){
        if(image && image.size>1024 * 1024 *2){
            throw createError(400,'File too large.It must be less then 2 MB');
        }
        // updates.image = image.buffer.toString('base64');
        updates.image = image;
        user.image !== 'default.png' && deleteImage (user.image);
    }
    
    //object to field exclude
    // delete updates.email;

    const updatedUser = await User.findByIdAndUpdate(
        userId,
        updates,
        updateOptions
        ).select("-password");
    if(!updatedUser){
        throw createError(404,'File too large.It must be less then 2 MB');
    }

    return updatedUser;
    
 }catch(error){
    // console.log(error); // Check the error type and properties
    if (error instanceof mongoose.Error.CastError) {
        throw createError(400, 'Invalid Id');
    }
    throw error;
 }
};

const ForgotPassworByEmail = async(email)=>{
    try {
        const userData = await User.findOne({email:email});
        if(!userData){
            throw createError(404,'Email is incorrert or you have not verified your email address.please register yourself first')
        }

        // create jwt
        const token = createJSONWebToken(
            {email},
            jwtresetPassKey,
            '10m'
            );
        
        //prepare email
        const emailData = {
            email,
            subject:'Reset Password Email',
            html:`
            <h2>Hello ${userData.name} ! </h2>
            <p>Please click here to link <a href="${clientURL}/api/users/reset-password/${token}" target="_blank">Reset Your Password</a></p>
            `
        }
        //send email
       try{
        await EmailWithNodeMailer(emailData);
        return token;
       }catch(emailError){
        next(createError(500,'Failed to send Reset Password Email'));
        return;
       }
        return successMessage;
    }catch (error) {
        throw(error);
    }
}

const ResetPassworByEmail = async(token,password)=>{
    try {
        const decoded = jwt.verify(token,jwtresetPassKey);
        if(!decoded){
            throw createError(400,"Invalid or Expired Token");
        }
        const filter = {email:decoded.email};
        const update = {password:password};
        const options ={new:true};
        const updateUser = await User.findOneAndUpdate(
            filter,
            update,
            options
        ).select('-password');

        if(!updateUser){
            throw createError(400,'User was not updated failed');
        }

    }catch (error) {
        throw(error);
    }
}

const handleUserAction = async(action,userId)=>{
    try {
        //console.log('Action received:', action); // Add this line for debugging

        let update;
        let successMessage;

        if (action === 'ban') {
            update = { isBanned: true };
            successMessage = 'User Was Banned Success';
        } else if (action === 'unban') {
            update = { isBanned: false };
            successMessage = 'User Was Unbanned Success';
        } else {
            throw createError(400, 'Invalid Action. Use ban or unban');
        }

        const updateOptions = {new:true, runvalidators:true, context:'query'}; 
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            update,
            updateOptions
            ).select("-password");
        if(!updatedUser){
            throw createError(400,'User was not Unbanned successfull');
        }
        return successMessage;
    }catch (error) {
        throw(error);
    }
}

module.exports = {handleUserAction,findUsers,findUserById,deleteUserById,updateUserById,ForgotPassworByEmail,ResetPassworByEmail};