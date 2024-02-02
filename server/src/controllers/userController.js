const createError = require('http-errors');
const fs = require('fs').promises;
const User = require('../models/userModel');
const { successResponse } = require('./responseController');
// const  mongoose  = require('mongoose');
const {findWithID} = require('../services/findItem');
const { deleteImage } = require('../helper/deleteImage');
const { jwtactivationKey, clientURL } = require('../secret');
const { createJSONWebToken } = require('../helper/jsonwebtoken');
const EmailWithNodeMailer = require('../helper/email');

const getUsers = async(req,res,next)=>{
    // console.log("user profile");
    try{
        const search = req.query.search || "";
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 5;

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
        // res.status(200).send({
        //     message:"User was Return",
        //     users,
        //     pagination:{
        //         totalPages:Math.ceil(count/limit),
        //         currentPage:page,
        //         previousPage:page-1 > 0 ? page-1:null,
        //         nextPage:page+1 <= Math.ceil(count/limit) ? page+1:null,
        //     }
        // });

        return successResponse(res,{
            statusCode:200,
            message:'Users Were Returned successfully',
            payload:{
                message:"User was Return",
                users,
                pagination:{
                    totalPages:Math.ceil(count/limit),
                    currentPage:page,
                    previousPage:page-1 > 0 ? page-1:null,
                    nextPage:page+1 <= Math.ceil(count/limit) ? page+1:null,
                }
            }
        })
    }catch(error){
        // res.status(500).send(message.error);
        next(error);
    }
};


const getUserById = async(req,res,next)=>{
    try{
       const id = req.params.id;
       const options ={password:0};
       const user = await findWithID(User,id,options);
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


const deleteUserById = async(req,res,next)=>{
    try{
       const id = req.params.id;
       const options ={password:0};
       const user = await findWithID(User,id,options);
       const userImagePath = user.image;
       deleteImage(userImagePath);

    //option 2
    //    fs.access(userImagePath)
    //    .then(()=>fs.unlink(userImagePath))
    //    .then(()=>console.log("user image was deleted"))
    //    .catch((err)=>console.error('user image does not exist'));

    //option 1
    //    fs.access(userImagePath,(err)=>{
    //        if(err){
    //         console.error('user image does not exist');
    //        }else{
    //         fs.unlink(userImagePath,(err)=>{
    //             if(err){
    //                 throw err;
    //             }else{
    //                 console.log("user image was deleted");
    //             }
    //         })
    //        }
    //    })

       await User.findByIdAndDelete({_id:id,isAdmin:false})

        return successResponse(res,{
            statusCode:200,
            message:'User Wes Delete successfully',
            // payload:{user},
        })
    }catch(error){
        next(error);
    }
};


const processRegister = async(req,res,next)=>{
    try{
        const {name,email,password,phone,address} = req.body;
        const userExists = await User.exists({email:email});
        if(userExists){
            throw createError(409,'User already exits. please login');
        }
        const token = createJSONWebToken(
            {name,email,password,phone,address},
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

       try{
        await EmailWithNodeMailer(emailData);
       }catch(emailError){
        next(createError(500,'Failed to send verification email'));
        return;
       }
        // const newUser ={
        //     name,
        //     email,
        //     password,
        //     phone,
        //     address
        // }
        // console.log(token);
        return successResponse(res,{
            statusCode:200,
            message:`Please go to your email ${email}  for completing your registerton process`,
            payload:{token},
        })
    }catch(error){
        next(error);
    }
};

module.exports ={getUsers,getUserById,deleteUserById,processRegister};